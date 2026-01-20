// Most of this code was adapted from https://github.com/changesets/action, 
// which unfortunately doesn't support more granular usage of their code,
//
// To test this script without actually creating releases, set DRY_RUN=true:
//   DRY_RUN=true tsx scripts/release.ts
// or
//   DRY_RUN=1 tsx scripts/release.ts
//
import fs from 'node:fs/promises';
import path from 'node:path';
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as github from '@actions/github';
import { getPackages, type Package } from '@manypkg/get-packages';
import { toString as mdastToString } from 'mdast-util-to-string';
import { remark } from 'remark';

const DRY_RUN = process.env.DRY_RUN === 'true' || process.env.DRY_RUN === '1';
const octokit = DRY_RUN ? null : github.getOctokit(process.env.GITHUB_TOKEN || '');

const processor = remark();

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
    // we can find a changelog but not the entry for this version
    // if this is true, something has probably gone wrong
    throw new Error(
      `Could not find changelog entry for ${pkg.packageJson.name}@${pkg.packageJson.version}`,
    );
  }

  if (DRY_RUN) {
    console.log('[DRY RUN] Would create release:', {
      name: tagName,
      tag_name: tagName,
      body: changelogEntry.content.substring(0, 100) + '...',
      prerelease: pkg.packageJson.version.includes('-'),
      repo: github.context.repo,
    });
    return;
  }

  await octokit!.rest.repos.createRelease({
    name: tagName,
    tag_name: tagName,
    body: changelogEntry.content,
    prerelease: pkg.packageJson.version.includes('-'),
    ...github.context.repo,
  });
};

(async () => {
  if (DRY_RUN) {
    console.log('[DRY RUN MODE] No actual releases, tags, or git operations will be performed');
  }

  const { packages } = await getPackages(process.cwd());

  if (!DRY_RUN) {
    await exec('git', ['config', 'user.name', `"github-actions[bot]"`]);
    await exec('git', [
      'config',
      'user.email',
      `"41898282+github-actions[bot]@users.noreply.github.com"`,
    ]);
  } else {
    console.log('[DRY RUN] Would configure git user');
  }

  for (const pkg of packages) {
    const tagName = `${pkg.packageJson.name}@${pkg.packageJson.version}`;
    console.log(`Creating release for ${tagName}`);
    await createRelease({ pkg, tagName });
    
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would create git tag: ${tagName}`);
      console.log(`[DRY RUN] Would push tag to origin: ${tagName}`);
    } else {
      octokit!.rest.git
        .createRef({
          ...github.context.repo,
          ref: `refs/tags/${tagName}`,
          sha: github.context.sha,
        })
        .catch((error: unknown) => {
          core.warning(`Failed to create tag ${tagName}: ${error}`);
        });
      await exec('git', ['push', 'origin', tagName]);
    }
  }
})();
