import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const packages = [
  'body',
  'button',
  'code-block',
  'code-inline',
  'column',
  'components',
  'container',
  'create-email',
  'font',
  'head',
  'heading',
  'hr',
  'html',
  'img',
  'link',
  'markdown',
  'preview',
  'preview-server',
  'react-email',
  'render',
  'row',
  'section',
  'tailwind',
  'text',
];

interface PackageLog {
  package: string;
  version: string;
  contents: string;
}

const changesPerDate = new Map<string, PackageLog[]>();

for await (const packageName of packages) {
  console.log(`Gathering changelog data for ${packageName}...`);
  const packageChangelogPath = path.resolve(
    import.meta.dirname,
    '../../../packages',
    packageName,
    'CHANGELOG.md',
  );
  const packageChangelog = await fs.readFile(packageChangelogPath, 'utf8');

  const logStartMatches = Array.from(
    packageChangelog.matchAll(
      /^##\s*(?<version>\d+\.\d+\.\d+(?<preRelease>-\w+(\.\d+)?)?)/gm,
    ),
  );

  for (const [i, match] of logStartMatches.entries()) {
    const matchLine = packageChangelog
      .slice(0, match.index)
      .split(/\r\n|\n|\r/).length;

    if (match.groups.preRelease) {
      continue;
    }

    const date = (() => {
      const blameAuthorTimeMatch = spawnSync(
        `git blame --line-porcelain -L ${matchLine},${matchLine} ${packageChangelogPath}`,
        {
          shell: true,
          stdio: 'pipe',
        },
      )
        .stdout.toString()
        .match(/author-time (?<timestamp>\d+)/);
      return new Date(
        Number.parseInt(blameAuthorTimeMatch.groups.timestamp, 10) * 1000,
      );
    })();

    let contents: string = (() => {
      const nextMatch = logStartMatches[i + 1];
      const rawContents = nextMatch
        ? packageChangelog.slice(match.index, nextMatch.index)
        : packageChangelog.slice(match.index);

      return rawContents
        .replaceAll(match[0], '')
        .replaceAll(/\[?[a-f0-9]{7}\]?(: )?/g, '')
        .trim();
    })();
    if (contents.length > 0) {
      contents = `${contents}\n\n`;
    }

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    if (!changesPerDate.has(formattedDate)) {
      changesPerDate.set(formattedDate, []);
    }

    changesPerDate.get(formattedDate)!.push({
      package: packageName,
      version: match.groups.version,
      contents,
    });
  }
}

const sortedChanges = Array.from(changesPerDate.entries()).toSorted(
  ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
);

console.log(
  'changes on dates ',
  sortedChanges.map((c) => c[0]),
);

let changelog = `---
title: "Changelog"
sidebarTitle: "Changelog"
description: "New features, bug fixes, and improvements made to each package."
"og:image": "https://react.email/static/covers/react-email.png"
icon: "list-check"
---

`;

console.info('Writing changelog.mdx file...');
for (const [formattedDate, changes] of sortedChanges) {
  changelog += `<Update label="${formattedDate}">\n`;

  for (const change of changes) {
    const prettyName = change.package
      .replaceAll(/-+([a-z])/g, (_, character) => ` ${character.toUpperCase()}`)
      .replace(/^([a-z])/, (_, character) => character.toUpperCase());
    changelog += `## ${prettyName} ${change.version}\n\n`;
    changelog += change.contents.replaceAll(/(`[^`]*`)|<|>/g, (match) => {
      if (match.startsWith('`')) {
        return match; // Keep inline code unchanged
      }
      return match === '<' ? '\\<' : '\\>';
    });
  }

  changelog += '</Update>\n';
}

await fs.writeFile('changelog.mdx', changelog, 'utf8');
