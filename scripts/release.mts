// Most of this code was adapted from https://github.com/changesets/action,
// which unfortunately doesn't support more granular usage of their code
import fs from 'node:fs/promises';
import path from 'node:path';
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as github from '@actions/github';
import { readPreState } from '@changesets/pre';
import { getPackages, type Package } from '@manypkg/get-packages';
import { toString as mdastToString } from 'mdast-util-to-string';
import { remark } from 'remark';
import {
  checkPublished,
  createPublisher,
  toWorkspacePackage,
  topologicalPublish,
  topologicalPublishDryRun,
} from './release-utils.mts';

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

(async () => {
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

  const distTag = preState?.mode === 'pre' ? preState.tag : 'latest';

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
      packages: packages.map(toWorkspacePackage),
      distTag,
      buildFailed,
      checkPublished,
    });
    return;
  } else {
    const result = await topologicalPublish({
      packages: packages.map(toWorkspacePackage),
      checkPublished,
      publish: createPublisher({ distTag, npmIdToken }),
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
})();
