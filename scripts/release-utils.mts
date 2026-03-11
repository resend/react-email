import fs from 'node:fs/promises';
import path from 'node:path';
import { exec, getExecOutput } from '@actions/exec';
import type { Package } from '@manypkg/get-packages';

export interface PackageInfo {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface WorkspacePackage extends PackageInfo {
  dir: string;
  private?: boolean;
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
    devDependencies: pkg.packageJson.devDependencies as
      | Record<string, string>
      | undefined,
  };
}

export async function checkPublished(
  name: string,
  version: string,
): Promise<boolean> {
  const result = await getExecOutput(
    'npm',
    ['view', `${name}@${version}`, 'version'],
    { ignoreReturnCode: true, silent: true },
  );
  return result.exitCode === 0 && result.stdout.trim() === version;
}

/**
 * Returns a publish callback that calls `pnpm publish` for a single package.
 */
export function createPublisher(options: {
  distTag: string;
  npmIdToken: string;
}): (pkg: WorkspacePackage) => Promise<boolean> {
  const env = {
    ...process.env,
    NPM_ID_TOKEN: options.npmIdToken,
    NPM_CONFIG_PROVENANCE: 'true',
  };

  return async (pkg) => {
    try {
      await exec(
        'pnpm',
        [
          'publish',
          '--no-git-checks',
          '--access',
          'public',
          '--tag',
          options.distTag,
        ],
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

/**
 * Build a dependency graph scoped to the given publish set.
 * Returns a map from each package name to the set of its dependencies
 * that are also in the publish set.
 */
export function buildPublishDeps(
  packages: PackageInfo[],
): Map<string, Set<string>> {
  const publishSet = new Set(packages.map((p) => p.name));
  const publishDeps = new Map<string, Set<string>>();

  for (const pkg of packages) {
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    const inSetDeps = new Set<string>();
    for (const depName of Object.keys(allDeps)) {
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

/**
 * High-level publish pipeline: determine which packages need publishing,
 * build a dependency graph, topologically sort, and publish with failure tracking.
 *
 * Callbacks isolate side-effects (npm registry checks, `pnpm publish`) so that
 * the orchestration logic stays testable without mocking modules.
 */
export async function topologicalPublish(options: {
  packages: WorkspacePackage[];
  checkPublished: (name: string, version: string) => Promise<boolean>;
  publish: (pkg: WorkspacePackage) => Promise<boolean>;
}): Promise<{ published: string[]; failed: string[] }> {
  const { packages, checkPublished: isPublished, publish } = options;

  // Determine which packages need publishing
  const toPublish: WorkspacePackage[] = [];
  for (const pkg of packages) {
    if (pkg.private) continue;
    const alreadyPublished = await isPublished(pkg.name, pkg.version);
    if (alreadyPublished) {
      console.log(`${pkg.name}@${pkg.version} already published, skipping`);
    } else {
      console.log(`${pkg.name}@${pkg.version} needs publishing`);
      toPublish.push(pkg);
    }
  }

  if (toPublish.length === 0) {
    console.log('No packages need publishing');
    return { published: [], failed: [] };
  }

  const publishDeps = buildPublishDeps(toPublish);
  const sorted = topologicalSort(publishDeps);

  console.log(`Publishing ${sorted.length} packages in topological order:`);
  for (const name of sorted) {
    console.log(`  ${name}`);
  }

  const byName = new Map(toPublish.map((p) => [p.name, p]));

  return publishInOrder(sorted, publishDeps, async (name) => {
    return publish(byName.get(name)!);
  });
}

async function defaultCheckBuildStatus(dir: string): Promise<boolean> {
  try {
    await fs.access(path.join(dir, 'dist'));
    return true;
  } catch {
    return false;
  }
}

/**
 * Dry-run variant: checks the registry, builds the dependency graph,
 * and prints the topological publish plan without actually publishing.
 */
export async function topologicalPublishDryRun(options: {
  packages: WorkspacePackage[];
  distTag: string;
  buildFailed: boolean;
  checkPublished: (name: string, version: string) => Promise<boolean>;
  checkBuildStatus?: (dir: string) => Promise<boolean>;
}): Promise<void> {
  const {
    packages,
    distTag,
    buildFailed,
    checkPublished: isPublished,
    checkBuildStatus = defaultCheckBuildStatus,
  } = options;

  const toPublish: WorkspacePackage[] = [];
  for (const pkg of packages) {
    if (pkg.private) continue;
    const alreadyPublished = await isPublished(pkg.name, pkg.version);
    if (alreadyPublished) {
      console.log(`${pkg.name}@${pkg.version} already published, skipping`);
    } else {
      console.log(`${pkg.name}@${pkg.version} needs publishing`);
      toPublish.push(pkg);
    }
  }

  if (toPublish.length === 0) {
    console.log('No packages need publishing');
    return;
  }

  const publishDeps = buildPublishDeps(toPublish);
  const sorted = topologicalSort(publishDeps);

  console.log(
    `\nWould publish ${sorted.length} packages in topological order:`,
  );
  const byName = new Map(toPublish.map((p) => [p.name, p]));

  for (const name of sorted) {
    const pkg = byName.get(name)!;
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
