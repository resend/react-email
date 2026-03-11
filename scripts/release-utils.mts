import fs from 'node:fs/promises';
import path from 'node:path';
import { type ExecOutput, exec, getExecOutput } from '@actions/exec';
import type { Package } from '@manypkg/get-packages';

export interface PackageInfo {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
  devDependencies?: Record<string, string>;
}

export interface WorkspacePackage extends PackageInfo {
  dir: string;
  private?: boolean;
}

export interface PackagePublicationInfo {
  publishedVersions: string[];
}

export type PublishedState = 'never' | 'published' | 'only-pre';

interface PublishTarget {
  distTag: string;
  pkg: WorkspacePackage;
}

export function toWorkspacePackage(pkg: Package): WorkspacePackage {
  return {
    name: pkg.packageJson.name,
    version: pkg.packageJson.version,
    dir: pkg.dir,
    private: pkg.packageJson.private ?? undefined,
    dependencies: pkg.packageJson.dependencies as
      | Record<string, string>
      | undefined,
    optionalDependencies: pkg.packageJson.optionalDependencies as
      | Record<string, string>
      | undefined,
    peerDependencies: pkg.packageJson.peerDependencies as
      | Record<string, string>
      | undefined,
    peerDependenciesMeta: pkg.packageJson.peerDependenciesMeta as
      | Record<string, { optional?: boolean }>
      | undefined,
    devDependencies: pkg.packageJson.devDependencies as
      | Record<string, string>
      | undefined,
  };
}

function isNpmNotFoundOutput(output: string): boolean {
  return (
    /\bE404\b/i.test(output) ||
    /404 Not Found/i.test(output) ||
    /is not in (?:this|the npm) registry/i.test(output)
  );
}

function getPrereleaseTag(version: string): string | undefined {
  const [, prerelease] = version.split('-', 2);
  return prerelease?.split('.')[0];
}

export function parseNpmViewVersionsOutput(
  packageName: string,
  result: Pick<ExecOutput, 'exitCode' | 'stdout' | 'stderr'>,
): string[] {
  const stdout = result.stdout.trim();
  const stderr = result.stderr.trim();

  if (result.exitCode === 0) {
    if (stdout.length === 0) {
      return [];
    }

    const parsed = JSON.parse(stdout) as string[] | string;
    if (typeof parsed === 'string') {
      return [parsed];
    }
    if (
      Array.isArray(parsed) &&
      parsed.every((value) => typeof value === 'string')
    ) {
      return parsed;
    }
    throw new Error(
      `Unexpected npm registry response for ${packageName}: ${stdout}`,
    );
  }

  const combinedOutput = [stderr, stdout].filter(Boolean).join('\n');
  if (isNpmNotFoundOutput(combinedOutput)) {
    return [];
  }

  throw new Error(
    `Failed to check npm registry for ${packageName}: ${
      combinedOutput || `exit code ${result.exitCode}`
    }`,
  );
}

export async function getPackagePublicationInfo(
  name: string,
): Promise<PackagePublicationInfo> {
  const result = await getExecOutput(
    'npm',
    ['view', name, 'versions', '--json'],
    { ignoreReturnCode: true, silent: true },
  );
  return {
    publishedVersions: parseNpmViewVersionsOutput(name, result),
  };
}

export function isVersionPublished(
  publicationInfo: PackagePublicationInfo,
  version: string,
): boolean {
  return publicationInfo.publishedVersions.includes(version);
}

export function getPublishedState(
  publicationInfo: PackagePublicationInfo,
  preTag?: string,
): PublishedState {
  if (publicationInfo.publishedVersions.length === 0) {
    return 'never';
  }

  if (
    preTag !== undefined &&
    publicationInfo.publishedVersions.every(
      (version) => getPrereleaseTag(version) === preTag,
    )
  ) {
    return 'only-pre';
  }

  return 'published';
}

export function getReleaseTag(
  publicationInfo: PackagePublicationInfo,
  preTag?: string,
): string {
  if (
    preTag !== undefined &&
    getPublishedState(publicationInfo, preTag) !== 'only-pre'
  ) {
    return preTag;
  }
  return 'latest';
}

/**
 * Returns a publish callback that calls `pnpm publish` for a single package.
 */
export function createPublisher(options: {
  npmIdToken: string;
}): (pkg: WorkspacePackage, distTag: string) => Promise<boolean> {
  const env = {
    ...process.env,
    NPM_ID_TOKEN: options.npmIdToken,
    NPM_CONFIG_PROVENANCE: 'true',
  };

  return async (pkg, distTag) => {
    try {
      await exec(
        'pnpm',
        ['publish', '--no-git-checks', '--access', 'public', '--tag', distTag],
        { cwd: pkg.dir, env },
      );
      console.log(`Successfully published ${pkg.name}@${pkg.version}`);
      return true;
    } catch (error) {
      console.error(`Failed to publish ${pkg.name}@${pkg.version}: ${error}`);
      return false;
    }
  };
}

function getRequiredPeerDependencies(
  pkg: Pick<PackageInfo, 'peerDependencies' | 'peerDependenciesMeta'>,
): Record<string, string> {
  const peerDependencies = pkg.peerDependencies ?? {};
  const peerDependenciesMeta = pkg.peerDependenciesMeta ?? {};
  return Object.fromEntries(
    Object.entries(peerDependencies).filter(
      ([name]) => peerDependenciesMeta[name]?.optional !== true,
    ),
  );
}

/**
 * Build a dependency graph scoped to the given publish set.
 * Returns a map from each package name to the set of its runtime deps and
 * required peer deps that are also in the publish set.
 */
export function buildPublishDeps(
  packages: PackageInfo[],
): Map<string, Set<string>> {
  const publishSet = new Set(packages.map((p) => p.name));
  const publishDeps = new Map<string, Set<string>>();

  for (const pkg of packages) {
    const runtimeDeps = {
      ...pkg.dependencies,
      ...pkg.optionalDependencies,
      ...getRequiredPeerDependencies(pkg),
    };
    const inSetDeps = new Set<string>();
    for (const depName of Object.keys(runtimeDeps)) {
      if (publishSet.has(depName)) {
        inSetDeps.add(depName);
      }
    }
    publishDeps.set(pkg.name, inSetDeps);
  }

  return publishDeps;
}

/**
 * Topological sort using Kahn's algorithm.
 * Leaf packages (no dependencies in the set) come first.
 * Throws if a cycle is detected.
 */
export function topologicalSort(
  publishDeps: Map<string, Set<string>>,
): string[] {
  const names = new Set(publishDeps.keys());
  const inDegree = new Map<string, number>();
  const reverseDeps = new Map<string, Set<string>>();

  for (const name of names) {
    inDegree.set(name, 0);
    reverseDeps.set(name, new Set());
  }
  for (const [name, depSet] of publishDeps) {
    inDegree.set(name, depSet.size);
    for (const dep of depSet) {
      reverseDeps.get(dep)!.add(name);
    }
  }

  const sorted: string[] = [];
  const queue: string[] = [];
  for (const [name, degree] of inDegree) {
    if (degree === 0) queue.push(name);
  }
  while (queue.length > 0) {
    const name = queue.shift()!;
    sorted.push(name);
    for (const dependent of reverseDeps.get(name) ?? []) {
      const newDegree = inDegree.get(dependent)! - 1;
      inDegree.set(dependent, newDegree);
      if (newDegree === 0) queue.push(dependent);
    }
  }

  if (sorted.length !== names.size) {
    const missing = [...names].filter((n) => !sorted.includes(n));
    throw new Error(
      `Circular dependency detected among packages to publish: ${missing.join(', ')}`,
    );
  }

  return sorted;
}

/**
 * Given a topological order and a dependency map, publish packages
 * with failure tracking. Returns the sets of published and failed package names.
 *
 * `publishFn` is called for each package that is eligible (none of its
 * dependencies failed). It should return true on success, false on failure.
 */
export async function publishInOrder(
  sorted: string[],
  publishDeps: Map<string, Set<string>>,
  publishFn: (name: string) => Promise<boolean>,
): Promise<{ published: string[]; failed: string[] }> {
  const failedSet = new Set<string>();
  const published: string[] = [];

  for (const name of sorted) {
    const pkgDeps = publishDeps.get(name)!;
    const failedDep = [...pkgDeps].find((d) => failedSet.has(d));
    if (failedDep) {
      failedSet.add(name);
      continue;
    }

    const success = await publishFn(name);
    if (success) {
      published.push(name);
    } else {
      failedSet.add(name);
    }
  }

  return { published, failed: [...failedSet] };
}

async function collectPublishTargets(options: {
  packages: WorkspacePackage[];
  preTag?: string;
  getPackagePublicationInfo: (name: string) => Promise<PackagePublicationInfo>;
}): Promise<PublishTarget[]> {
  const { packages, preTag, getPackagePublicationInfo: getInfo } = options;
  const toPublish: PublishTarget[] = [];

  for (const pkg of packages) {
    if (pkg.private) continue;

    const publicationInfo = await getInfo(pkg.name);
    if (isVersionPublished(publicationInfo, pkg.version)) {
      console.log(`${pkg.name}@${pkg.version} already published, skipping`);
      continue;
    }

    console.log(`${pkg.name}@${pkg.version} needs publishing`);
    const distTag = getReleaseTag(publicationInfo, preTag);
    if (preTag !== undefined && distTag !== preTag) {
      console.log(
        `${pkg.name} will be published to ${distTag} rather than ${preTag} because it has only ${preTag} prereleases on npm`,
      );
    }
    toPublish.push({ distTag, pkg });
  }

  return toPublish;
}

/**
 * High-level publish pipeline: determine which packages need publishing,
 * build a dependency graph, topologically sort, and publish with failure tracking.
 *
 * Callbacks isolate side-effects (npm registry checks, `pnpm publish`) so that
 * the orchestration logic stays testable without mocking modules.
 */
export async function topologicalPublish(options: {
  packages: WorkspacePackage[];
  preTag?: string;
  getPackagePublicationInfo: (name: string) => Promise<PackagePublicationInfo>;
  publish: (pkg: WorkspacePackage, distTag: string) => Promise<boolean>;
}): Promise<{ published: string[]; failed: string[] }> {
  const {
    packages,
    preTag,
    getPackagePublicationInfo: getInfo,
    publish,
  } = options;
  const toPublish = await collectPublishTargets({
    packages,
    preTag,
    getPackagePublicationInfo: getInfo,
  });

  if (toPublish.length === 0) {
    console.log('No packages need publishing');
    return { published: [], failed: [] };
  }

  const publishDeps = buildPublishDeps(toPublish.map(({ pkg }) => pkg));
  const sorted = topologicalSort(publishDeps);

  console.log(`Publishing ${sorted.length} packages in topological order:`);
  for (const name of sorted) {
    console.log(`  ${name}`);
  }

  const byName = new Map(toPublish.map((target) => [target.pkg.name, target]));

  return publishInOrder(sorted, publishDeps, async (name) => {
    const target = byName.get(name)!;
    return publish(target.pkg, target.distTag);
  });
}

async function defaultCheckBuildStatus(dir: string): Promise<boolean> {
  const packageJson = JSON.parse(
    await fs.readFile(path.join(dir, 'package.json'), 'utf8'),
  ) as {
    scripts?: Record<string, string>;
  };

  if (packageJson.scripts?.build === undefined) {
    return true;
  }

  for (const buildOutputDir of ['dist', '.next']) {
    try {
      await fs.access(path.join(dir, buildOutputDir));
      return true;
    } catch {
      continue;
    }
  }

  return false;
}

/**
 * Dry-run variant: checks the registry, builds the dependency graph,
 * and prints the topological publish plan without actually publishing.
 */
export async function topologicalPublishDryRun(options: {
  packages: WorkspacePackage[];
  preTag?: string;
  buildFailed: boolean;
  getPackagePublicationInfo: (name: string) => Promise<PackagePublicationInfo>;
  checkBuildStatus?: (dir: string) => Promise<boolean>;
}): Promise<void> {
  const {
    packages,
    preTag,
    buildFailed,
    getPackagePublicationInfo: getInfo,
    checkBuildStatus = defaultCheckBuildStatus,
  } = options;
  const toPublish = await collectPublishTargets({
    packages,
    preTag,
    getPackagePublicationInfo: getInfo,
  });

  if (toPublish.length === 0) {
    console.log('No packages need publishing');
    return;
  }

  const publishDeps = buildPublishDeps(toPublish.map(({ pkg }) => pkg));
  const sorted = topologicalSort(publishDeps);

  console.log(
    `\nWould publish ${sorted.length} packages in topological order:`,
  );
  const byName = new Map(toPublish.map((target) => [target.pkg.name, target]));

  for (const name of sorted) {
    const target = byName.get(name)!;
    const { pkg, distTag } = target;
    let buildStatus: string;
    if (buildFailed) {
      buildStatus = (await checkBuildStatus(pkg.dir))
        ? 'built'
        : 'build failed';
    } else {
      buildStatus = 'built';
    }
    const deps = publishDeps.get(name)!;
    const depStr =
      deps.size > 0 ? ` (depends on: ${[...deps].join(', ')})` : '';
    console.log(
      `  [${buildStatus}] ${name}@${pkg.version} -> ${distTag}${depStr}`,
    );
  }
  console.log('\nDry run complete. No packages were published.');
}
