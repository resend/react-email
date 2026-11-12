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

// `getOctokit` requires a non-empty token; the fallback keeps importing this
// module (e.g. from the test suite) from throwing when no token is present.
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

// changesets publishes every package whose version isn't on npm yet, but it
// does so in no particular order and keeps going when one fails. That can leave
// `@react-email/components` published while a component it re-exports is not
// (see GitHub #3045). The pipeline below replaces `changeset publish`: it
// publishes in dependency order and, when a package fails, skips its dependents
// so a broken dependency can never produce a broken dependent.

/**
 * Parses the output of `npm view <pkg> versions --json`. A missing package
 * (npm 404) means nothing is published yet, so we return an empty list. Any
 * other failure is re-thrown — a flaky registry must never be mistaken for an
 * unpublished package, which would make us republish or mis-tag.
 */
export function parseNpmVersions(
  packageName: string,
  result: Pick<ExecOutput, 'exitCode' | 'stdout' | 'stderr'>,
): string[] {
  if (result.exitCode === 0) {
    const stdout = result.stdout.trim();
    if (stdout.length === 0) {
      return [];
    }
    const parsed = JSON.parse(stdout) as string | string[];
    return Array.isArray(parsed) ? parsed : [parsed];
  }

  const output = `${result.stderr}\n${result.stdout}`;
  if (
    /\bE404\b|404 Not Found|is not in (?:this|the npm) registry/i.test(output)
  ) {
    return [];
  }

  throw new Error(
    `Failed to read published versions for ${packageName}: ${
      result.stderr.trim() || `npm exited with code ${result.exitCode}`
    }`,
  );
}

const getPublishedVersions = async (packageName: string): Promise<string[]> => {
  const result = await getExecOutput(
    'npm',
    ['view', packageName, 'versions', '--json'],
    { ignoreReturnCode: true, silent: true },
  );
  return parseNpmVersions(packageName, result);
};

const prereleaseTagOf = (version: string): string | undefined =>
  version.split('-')[1]?.split('.')[0];

/**
 * The npm dist-tag for a version, taken from the version itself: a plain
 * `x.y.z` release goes to `latest`, while a prerelease goes to its prerelease
 * identifier (`6.0.0-canary.2` -> `canary`, `1.0.0-alpha.7` -> `alpha`). This
 * matches the dist-tags this repo already publishes and guarantees a prerelease
 * never overwrites `latest`.
 */
export function selectDistTag(version: string): string {
  return prereleaseTagOf(version) ?? 'latest';
}

type PackageJsonWithPeerMeta = Package['packageJson'] & {
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
};

/**
 * Runtime dependencies of a package: regular, optional, and required peer
 * dependencies. devDependencies are excluded — they needn't exist on npm for
 * the package to install, so they must not constrain publish order.
 */
const runtimeDependenciesOf = (
  packageJson: PackageJsonWithPeerMeta,
): string[] => {
  const { peerDependencies = {}, peerDependenciesMeta = {} } = packageJson;
  const requiredPeers = Object.keys(peerDependencies).filter(
    (name) => peerDependenciesMeta[name]?.optional !== true,
  );
  return [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
    ...requiredPeers,
  ];
};

/**
 * Maps each package to the set of packages it depends on *within the publish
 * set*. External dependencies (already on npm) don't affect publish order.
 */
export function buildPublishGraph(
  packages: Package[],
): Map<string, Set<string>> {
  const inSet = new Set(packages.map((pkg) => pkg.packageJson.name));
  return new Map(
    packages.map((pkg) => [
      pkg.packageJson.name,
      new Set(
        runtimeDependenciesOf(pkg.packageJson).filter((name) =>
          inSet.has(name),
        ),
      ),
    ]),
  );
}

/**
 * Orders packages so each one comes after the dependencies it has within the
 * set (leaves first). Throws if the graph contains a cycle.
 */
export function topologicalSort(graph: Map<string, Set<string>>): string[] {
  const remaining = new Map(
    [...graph].map(([name, deps]) => [name, new Set(deps)]),
  );
  const ordered: string[] = [];

  while (remaining.size > 0) {
    const ready = [...remaining]
      .filter(([, deps]) => deps.size === 0)
      .map(([name]) => name);

    if (ready.length === 0) {
      throw new Error(
        `Cannot publish: dependency cycle between ${[...remaining.keys()].join(', ')}`,
      );
    }

    for (const name of ready) {
      ordered.push(name);
      remaining.delete(name);
    }
    for (const deps of remaining.values()) {
      for (const name of ready) {
        deps.delete(name);
      }
    }
  }

  return ordered;
}

interface PublishTarget {
  pkg: Package;
  distTag: string;
}

/**
 * Determines which non-private packages still need publishing (version not yet
 * on npm) and the order to publish them in, with the dist-tag for each.
 */
const planPublish = async (options: {
  packages: Package[];
  getPublishedVersions: (name: string) => Promise<string[]>;
}): Promise<{ ordered: PublishTarget[]; graph: Map<string, Set<string>> }> => {
  const targets: PublishTarget[] = [];
  for (const pkg of options.packages) {
    if (pkg.packageJson.private === true) {
      continue;
    }
    const publishedVersions = await options.getPublishedVersions(
      pkg.packageJson.name,
    );
    if (publishedVersions.includes(pkg.packageJson.version)) {
      console.log(
        `${pkg.packageJson.name}@${pkg.packageJson.version} is already published, skipping`,
      );
      continue;
    }
    targets.push({
      pkg,
      distTag: selectDistTag(pkg.packageJson.version),
    });
  }

  const graph = buildPublishGraph(targets.map((target) => target.pkg));
  const byName = new Map(
    targets.map((target) => [target.pkg.packageJson.name, target]),
  );
  const ordered = topologicalSort(graph).map((name) => byName.get(name)!);
  return { ordered, graph };
};

export interface ManifestEntry {
  name: string;
  version: string;
  distTag: string;
  dir: string;
  dependsOn: string[];
}

export async function buildManifest(options: {
  packages: Package[];
  getPublishedVersions: (name: string) => Promise<string[]>;
}): Promise<ManifestEntry[]> {
  const { ordered, graph } = await planPublish(options);
  return ordered.map(({ pkg, distTag }) => ({
    name: pkg.packageJson.name,
    version: pkg.packageJson.version,
    distTag,
    dir: pkg.dir,
    dependsOn: [...(graph.get(pkg.packageJson.name) ?? [])],
  }));
}

/**
 * Prints what `publishPackages` would do, without publishing anything.
 */
export async function printPublishPlan(options: {
  packages: Package[];
  getPublishedVersions: (name: string) => Promise<string[]>;
}): Promise<void> {
  const { ordered, graph } = await planPublish(options);
  if (ordered.length === 0) {
    console.log('No packages need publishing');
    return;
  }

  console.log(
    `Would publish ${ordered.length} package(s) in dependency order:`,
  );
  for (const { pkg, distTag } of ordered) {
    const deps = [...(graph.get(pkg.packageJson.name) ?? [])];
    const dependsOn = deps.length > 0 ? ` (depends on ${deps.join(', ')})` : '';
    console.log(
      `  ${pkg.packageJson.name}@${pkg.packageJson.version} -> ${distTag}${dependsOn}`,
    );
  }
}

const packPackage = async (dir: string, outDir: string) => {
  const { stdout } = await getExecOutput(
    'pnpm',
    ['pack', '--json', '--pack-destination', outDir],
    { cwd: dir, silent: true },
  );
  const { filename } = JSON.parse(stdout) as { filename: string };
  return path.basename(filename);
};

const isReleaseRef = async () => {
  const { ref } = github.context;
  if (ref === 'refs/heads/canary') {
    console.log('Detected canary branch, checking prerelease state');
    const preState = await readPreState(process.cwd());
    if (preState?.mode !== 'pre') {
      console.log(
        'Was not in prerelease, skipping automated release. To release this you should rebase onto main',
      );
      return false;
    }
    console.log('Is in prerelease mode, proceeding with automated release');
    return true;
  }
  if (ref === 'refs/heads/main') {
    console.log('Detected main branch, proceeding with stable release');
    return true;
  }
  throw new Error(
    `Unexpected branch/ref: ${ref}. Expected refs/heads/main or refs/heads/canary`,
  );
};

const argumentAfter = (flag: string) => {
  const index = process.argv.indexOf(flag);
  const value = index === -1 ? undefined : process.argv[index + 1];
  if (index !== -1 && (value === undefined || value.startsWith('--'))) {
    throw new Error(`${flag} needs a path argument`);
  }
  return value;
};

const pack = async (packages: Package[], outDir: string) => {
  await fs.mkdir(outDir, { recursive: true });
  const dryRun = isTruthyEnv(process.env.RELEASE_DRY_RUN);
  const entries =
    dryRun || (await isReleaseRef())
      ? await buildManifest({
          packages,
          getPublishedVersions: dryRun ? async () => [] : getPublishedVersions,
        })
      : [];

  const packed: Omit<ManifestEntry & { tarball: string }, 'dir'>[] = [];
  if (entries.length === 0) {
    console.log('No packages need publishing');
  } else {
    await exec('pnpm', ['release:build']);
    for (const { dir, ...entry } of entries) {
      const tarball = await packPackage(dir, path.resolve(outDir));
      console.log(
        `Packed ${entry.name}@${entry.version} -> ${tarball} (${entry.distTag})`,
      );
      packed.push({ ...entry, tarball });
    }
  }

  await fs.writeFile(
    path.join(outDir, 'manifest.json'),
    JSON.stringify({ packages: packed }, null, 2),
  );
  core.setOutput('has_packages', String(packed.length > 0));
};

const main = async () => {
  const isDryRun = process.argv.includes('--dry-run');
  const packDir = argumentAfter('--pack');
  const resultsFile = argumentAfter('--github-releases');
  const onlyGithubReleases =
    isTruthyEnv(process.env.SKIP_NPM_PUBLISH) ||
    process.argv.includes('--skip-npm-publish') ||
    process.argv.includes('--only-github-releases');

  if (!isDryRun && (!github.context.repo.owner || !github.context.repo.repo)) {
    throw new Error(
      'GitHub context is missing. This script must be run in a GitHub Actions workflow.',
    );
  }

  const { packages } = await getPackages(process.cwd());
  const packagesByName = new Map(
    packages.map((pkg) => [pkg.packageJson.name, pkg]),
  );

  if (isDryRun) {
    await printPublishPlan({ packages, getPublishedVersions });
    return;
  }

  if (packDir !== undefined) {
    await pack(packages, packDir);
    return;
  }

  let releasedPackages: Package[] = [];
  let failedPackages: string[] = [];

  if (resultsFile !== undefined) {
    const results = JSON.parse(await fs.readFile(resultsFile, 'utf8')) as {
      published: string[];
      failed: string[];
    };
    releasedPackages = results.published.map(
      (name) => packagesByName.get(name)!,
    );
    failedPackages = results.failed;
    if (failedPackages.length > 0) {
      core.error(
        `Failed to publish ${failedPackages.length} package(s): ${failedPackages.join(', ')}`,
      );
    }
  } else if (onlyGithubReleases) {
    console.log(
      'SKIP_NPM_PUBLISH is set, skipping npm publish and only ensuring GitHub releases exist',
    );
    releasedPackages = packages.filter(
      (pkg) => pkg.packageJson.private !== true,
    );
  } else {
    throw new Error(
      'Pass --pack <dir>, --github-releases <results.json>, --only-github-releases or --dry-run',
    );
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

  // Fail the workflow so a broken release is never silently accepted.
  if (failedPackages.length > 0) {
    process.exitCode = 1;
  }
};

// Only run the release flow when executed directly, so the test suite can
// import the helpers above without triggering a real release.
if (
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await main();
}
