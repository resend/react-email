// Most of this code was adapted from https://github.com/changesets/action,
// which unfortunately doesn't support more granular usage of their code
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as core from '@actions/core';
import { type ExecOutput, exec, getExecOutput } from '@actions/exec';
import * as github from '@actions/github';
import { readPreState } from '@changesets/pre';
import { getPackages, type Package } from '@manypkg/get-packages';
import { toString as mdastToString } from 'mdast-util-to-string';
import { remark } from 'remark';

const isDryRun = process.argv.includes('--dry-run');

const octokit = github.getOctokit(process.env.GITHUB_TOKEN || 'placeholder');

const processor = remark();
const LATEST_GITHUB_RELEASE_PACKAGE_NAME = 'react-email';

export const BumpLevels = {
  dep: 0,
  patch: 1,
  minor: 2,
  major: 3,
} as const;

export function getChangelogEntry(changelog: string, version: string) {
  const ast = processor.parse(changelog);

  let highestLevel: number = BumpLevels.dep;

  const nodes = ast.children;
  let headingStartInfo:
    | {
        index: number;
        depth: number;
      }
    | undefined;
  let endIndex: number | undefined;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === 'heading') {
      const stringified: string = mdastToString(node);
      const match = stringified.toLowerCase().match(/(major|minor|patch)/);
      if (match !== null) {
        const level = BumpLevels[match[0] as 'major' | 'minor' | 'patch'];
        highestLevel = Math.max(level, highestLevel);
      }
      if (headingStartInfo === undefined && stringified === version) {
        headingStartInfo = {
          index: i,
          depth: node.depth,
        };
        continue;
      }
      if (
        endIndex === undefined &&
        headingStartInfo !== undefined &&
        headingStartInfo.depth === node.depth
      ) {
        endIndex = i;
        break;
      }
    }
  }
  if (headingStartInfo) {
    ast.children = ast.children.slice(headingStartInfo.index + 1, endIndex);
  }
  return {
    content: processor.stringify(ast),
    highestLevel,
  };
}

const createRelease = async ({
  pkg,
  tagName,
}: {
  pkg: Package;
  tagName: string;
}) => {
  const changelog = await fs.readFile(
    path.join(pkg.dir, 'CHANGELOG.md'),
    'utf8',
  );
  const changelogEntry = getChangelogEntry(changelog, pkg.packageJson.version);
  if (!changelogEntry) {
    // We can find a changelog but not the entry for this version
    // if this is true, something has probably gone wrong
    throw new Error(
      `Could not find changelog entry for ${pkg.packageJson.name}@${pkg.packageJson.version}`,
    );
  }
  const isPrerelease = pkg.packageJson.version.includes('-');
  const shouldMarkAsLatest =
    pkg.packageJson.name === LATEST_GITHUB_RELEASE_PACKAGE_NAME &&
    !isPrerelease;

  await octokit.rest.repos.createRelease({
    name: tagName,
    tag_name: tagName,
    body: changelogEntry.content,
    prerelease: isPrerelease,
    make_latest: shouldMarkAsLatest ? 'true' : 'false',
    ...github.context.repo,
  });
};

const releaseAlreadyExists = async (tagName: string) => {
  try {
    await octokit.rest.repos.getReleaseByTag({
      ...github.context.repo,
      tag: tagName,
    });
    return true;
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error as { status?: number }).status === 404
    ) {
      return false;
    }
    throw error;
  }
};

const ensureReleaseForPackage = async (pkg: Package) => {
  const tagName = `${pkg.packageJson.name}@${pkg.packageJson.version}`;
  await octokit.rest.git
    .createRef({
      ...github.context.repo,
      ref: `refs/tags/${tagName}`,
      sha: github.context.sha,
    })
    .catch((error: unknown) => {
      core.warning(`Failed to create tag ${tagName}: ${error}`);
    });

  if (await releaseAlreadyExists(tagName)) {
    console.log(`Release for ${tagName} already exists, skipping`);
    return;
  }

  console.log(`Creating release for ${tagName}`);
  await createRelease({ pkg, tagName });
};

const isTruthyEnv = (value: string | undefined) =>
  value !== undefined && /^(1|true|yes)$/i.test(value);

export interface PackagePublicationInfo {
  publishedVersions: string[];
}

export type PublishedState = 'never' | 'published' | 'only-pre';

type PackageJsonWithPeerDependenciesMeta = Package['packageJson'] & {
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
};

interface PublishTarget {
  distTag: string;
  pkg: Package;
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
}): (pkg: Package, distTag: string) => Promise<boolean> {
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
      console.log(
        `Successfully published ${pkg.packageJson.name}@${pkg.packageJson.version}`,
      );
      return true;
    } catch (error) {
      console.error(
        `Failed to publish ${pkg.packageJson.name}@${pkg.packageJson.version}: ${error}`,
      );
      return false;
    }
  };
}

function getRequiredPeerDependencies({
  peerDependencies = {},
  peerDependenciesMeta = {},
}: PackageJsonWithPeerDependenciesMeta): Record<string, string> {
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
  packages: Package[],
): Map<string, Set<string>> {
  const publishSet = new Set(packages.map((p) => p.packageJson.name));
  const publishDeps = new Map<string, Set<string>>();

  for (const pkg of packages) {
    const runtimeDeps = {
      ...pkg.packageJson.dependencies,
      ...pkg.packageJson.optionalDependencies,
      ...getRequiredPeerDependencies(pkg.packageJson),
    };
    const inSetDeps = new Set<string>();
    for (const depName of Object.keys(runtimeDeps)) {
      if (publishSet.has(depName)) {
        inSetDeps.add(depName);
      }
    }
    publishDeps.set(pkg.packageJson.name, inSetDeps);
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
  packages: Package[];
  preTag?: string;
  getPackagePublicationInfo: (name: string) => Promise<PackagePublicationInfo>;
}): Promise<PublishTarget[]> {
  const { packages, preTag, getPackagePublicationInfo: getInfo } = options;
  const toPublish: PublishTarget[] = [];

  for (const pkg of packages) {
    if (pkg.packageJson.private) continue;

    const publicationInfo = await getInfo(pkg.packageJson.name);
    if (isVersionPublished(publicationInfo, pkg.packageJson.version)) {
      console.log(
        `${pkg.packageJson.name}@${pkg.packageJson.version} already published, skipping`,
      );
      continue;
    }

    console.log(
      `${pkg.packageJson.name}@${pkg.packageJson.version} needs publishing`,
    );
    const distTag = getReleaseTag(publicationInfo, preTag);
    if (preTag !== undefined && distTag !== preTag) {
      console.log(
        `${pkg.packageJson.name} will be published to ${distTag} rather than ${preTag} because it has only ${preTag} prereleases on npm`,
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
  packages: Package[];
  preTag?: string;
  getPackagePublicationInfo: (name: string) => Promise<PackagePublicationInfo>;
  publish: (pkg: Package, distTag: string) => Promise<boolean>;
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

  const byName = new Map(
    toPublish.map((target) => [target.pkg.packageJson.name, target]),
  );

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
    } catch {}
  }

  return false;
}

/**
 * Dry-run variant: checks the registry, builds the dependency graph,
 * and prints the topological publish plan without actually publishing.
 */
export async function topologicalPublishDryRun(options: {
  packages: Package[];
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
  const byName = new Map(
    toPublish.map((target) => [target.pkg.packageJson.name, target]),
  );

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
      `  [${buildStatus}] ${name}@${pkg.packageJson.version} -> ${distTag}${depStr}`,
    );
  }
  console.log('\nDry run complete. No packages were published.');
}

export async function main() {
  const preState = await readPreState(process.cwd());
  const skipNpmPublish =
    isTruthyEnv(process.env.SKIP_NPM_PUBLISH) ||
    process.argv.includes('--skip-npm-publish') ||
    process.argv.includes('--only-github-releases');

  if (!isDryRun) {
    if (!github.context.repo.owner || !github.context.repo.repo) {
      throw new Error(
        'GitHub context is missing. This script must be run in a GitHub Actions workflow.',
      );
    }
  }

  if (!isDryRun && !skipNpmPublish) {
    const isCanaryBranch = github.context.ref === 'refs/heads/canary';
    const isMainBranch = github.context.ref === 'refs/heads/main';

    if (isCanaryBranch) {
      console.log(
        'Detected running in canary branch, checking prerelease state',
      );
      if (preState?.mode !== 'pre') {
        console.log(
          'Was not in prerelease, skipping automated release. To release this you should rebase onto main',
        );
        return;
      }
      console.log('Is in prerelease mode, proceeding with automated release');
    } else if (isMainBranch) {
      console.log(
        'Detected running in main branch, proceeding with stable release',
      );
    } else {
      throw new Error(
        `Unexpected branch/ref: ${github.context.ref}. Expected refs/heads/main or refs/heads/canary`,
      );
    }
  }

  const npmIdToken =
    !isDryRun && !skipNpmPublish
      ? await core.getIDToken('npm:registry.npmjs.org')
      : '';

  let buildFailed = false;
  if (!skipNpmPublish || isDryRun) {
    try {
      await exec('pnpm', ['turbo', 'run', 'build', '--filter=./packages/*']);
    } catch (error) {
      if (!isDryRun) throw error;
      buildFailed = true;
      console.error(`Build failed: ${error}`);
    }
  }

  const preTag = preState?.mode === 'pre' ? preState.tag : undefined;

  const { packages } = await getPackages(process.cwd());
  const publishablePackages = packages.filter(
    (pkg) => pkg.packageJson.private !== true,
  );
  const packagesByName = new Map(packages.map((x) => [x.packageJson.name, x]));

  let releasedPackages: Package[];
  let failedNames: string[] = [];

  if (skipNpmPublish) {
    console.log(
      'SKIP_NPM_PUBLISH is set, skipping npm publish and only ensuring GitHub releases exist',
    );
    releasedPackages = publishablePackages;
  } else if (isDryRun) {
    await topologicalPublishDryRun({
      packages,
      preTag,
      buildFailed,
      getPackagePublicationInfo,
    });
    return;
  } else {
    const result = await topologicalPublish({
      packages,
      preTag,
      getPackagePublicationInfo,
      publish: createPublisher({ npmIdToken }),
    });

    failedNames = result.failed;

    if (failedNames.length > 0) {
      core.error(
        `Failed to publish ${failedNames.length} package(s): ${failedNames.join(', ')}`,
      );
    }

    releasedPackages = result.published.map((n) => packagesByName.get(n)!);
  }

  await exec('git', ['config', 'user.name', `"github-actions[bot]"`]);
  await exec('git', [
    'config',
    'user.email',
    `"41898282+github-actions[bot]@users.noreply.github.com"`,
  ]);
  for (const pkg of releasedPackages) {
    await ensureReleaseForPackage(pkg);
  }

  if (failedNames.length > 0) {
    process.exitCode = 1;
  }
}

if (
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  await main();
}
