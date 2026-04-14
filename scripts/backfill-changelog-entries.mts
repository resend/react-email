import { execFile as execFileCb } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { Octokit } from '@octokit/core';

const execFile = promisify(execFileCb);

const REPO_OWNER = 'resend';
const REPO_NAME = 'react-email';

const CHANGELOG_PATH = path.resolve(
  import.meta.dirname,
  '../apps/docs/changelog.mdx',
);

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('Set GITHUB_TOKEN env var.');
  process.exit(1);
}

let sinceDate: string | undefined;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--since' && args[i + 1]) {
    sinceDate = args[++i];
  }
}

if (!sinceDate) {
  console.error('Missing --since flag. Usage: --since YYYY-MM-DD');
  process.exit(1);
}

const CUTOFF = new Date(`${sinceDate}T00:00:00Z`);

function toDisplayName(packageName: string): string {
  const name = packageName.replace('@react-email/', '');
  return name
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDateHeading(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface ReleaseEntry {
  displayName: string;
  version: string;
  body: string;
}

function buildRawEntry(dateKey: string, entries: ReleaseEntry[]): string {
  const lines: string[] = [`## ${formatDateHeading(dateKey)}`, ''];

  for (const entry of entries) {
    lines.push(`**${entry.displayName} ${entry.version}**`, '');
    lines.push('GitHub release body:', '```', entry.body, '```', '');
  }

  return lines.join('\n');
}

async function polishWithClaude(rawEntry: string): Promise<string> {
  const prompt = `You are editing a changelog file. Below is a raw changelog entry with GitHub release bodies included verbatim.
Extract the meaningful changes from each release body and rewrite the entry to match the style conventions shown in the examples below.

## Style examples

### Grouping packages with the same changes

When React Email and Preview Server (or any packages) share the same version number and same changes,
stack their bold headings together with a single shared bullet list:

**React Email 4.3.0**
**Preview Server 4.3.0**

- Added resize snapping, refined UI and improved presets

### Updated dependencies format

Use indented sub-items under an "Updated dependencies" bullet:

**Components 0.5.7**

- markdown: move out of md-to-react-email
- render: disable wordwrap in toPlainText by default
- Updated dependencies
    - @react-email/markdown@0.0.16
    - @react-email/render@1.4.0

### Standalone package entry

**Render 1.3.1**

- fixed multi-byte characters causing problems during stream reading

### Multiple releases on the same day

## October 17, 2025

**React Email 4.3.1**

- hot reloading errors when importing .json and other file extensions

**Preview Server 4.3.1**

- make everything in the global for the UI available to email contexts using a Proxy

**Render 1.4.0**

- disable wordwrap in toPlainText by default

**Markdown 0.0.16**

- move out of md-to-react-email

**Components 0.5.7**

- markdown: move out of md-to-react-email
- render: disable wordwrap in toPlainText by default
- Updated dependencies
    - @react-email/markdown@0.0.16
    - @react-email/render@1.4.0

## Rules

- Keep the ## date heading exactly as-is
- Keep **Package Name X.Y.Z** bold headings
- Extract changes from the release bodies — they may use different formats (changeset markdown, GitHub auto-generated, etc.)
- Strip commit hashes (e.g. "698f962: fix something" → "fix something")
- Strip conventional commit scopes (e.g. "fix(render): description" → "fix description")
- Strip "by @author in https://..." suffixes
- Strip "**Full Changelog**" links
- React Email and Preview Server always come in pairs — if only one is present, add the other with the same version and, if the other was not present, also changes
- Keep bullet points concise, lowercase start unless proper noun
- Do NOT invent changes, only rephrase or reorder what is given
- Do NOT add migration guide links unless one was in the raw entry
- Output ONLY the final markdown — no preamble, no explanation, no surrounding text whatsoever

## Raw entry

${rawEntry}`;

  const { stdout } = await execFile('claude', ['-p', prompt], {
    maxBuffer: 1024 * 1024,
  });

  const trimmed = stdout.trim();
  const headingIndex = trimmed.indexOf('## ');
  if (headingIndex > 0) return trimmed.slice(headingIndex);
  return trimmed;
}

async function insertEntry(polishedEntry: string) {
  const content = await fs.readFile(CHANGELOG_PATH, 'utf8');

  const frontmatterEnd = content.indexOf('---', content.indexOf('---') + 3);
  const insertPos = content.indexOf('\n', frontmatterEnd) + 1;

  const before = content.slice(0, insertPos);
  const after = content.slice(insertPos);

  await fs.writeFile(CHANGELOG_PATH, `${before}\n${polishedEntry}\n${after}`);
}

async function commitWithDate(dateKey: string) {
  const commitDate = `${dateKey}T12:00:00`;
  const heading = formatDateHeading(dateKey);

  await execFile('git', ['add', CHANGELOG_PATH]);
  await execFile('git', [
    'commit',
    '--date',
    commitDate,
    '-m',
    `docs: add changelog entry for ${heading}`,
  ]);
}

const octokit = new Octokit({ auth: token });
const byDate = new Map<string, ReleaseEntry[]>();
let page = 1;
let done = false;

while (!done) {
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: REPO_OWNER,
    repo: REPO_NAME,
    per_page: 100,
    page,
  });

  if (data.length === 0) break;

  for (const release of data) {
    const publishedAt = new Date(release.published_at || release.created_at);

    if (publishedAt < CUTOFF) {
      done = true;
      break;
    }

    if (release.prerelease) continue;

    const tagName = release.tag_name;
    const atIndex = tagName.lastIndexOf('@');
    if (atIndex <= 0 && !tagName.includes('@')) continue;

    const packageName = tagName.substring(0, atIndex);
    const version = tagName.substring(atIndex + 1);
    const dateKey = toDateKey(publishedAt);

    const entries = byDate.get(dateKey) ?? [];
    entries.push({
      displayName: toDisplayName(packageName),
      version,
      body: release.body || '',
    });
    byDate.set(dateKey, entries);
  }

  page++;
}

if (byDate.size === 0) {
  console.error(`No releases found since ${sinceDate}.`);
  process.exit(0);
}

const sortedDates = [...byDate.keys()].sort(
  (a, b) => new Date(a).getTime() - new Date(b).getTime(),
);

for (const dateKey of sortedDates) {
  const entries = byDate.get(dateKey)!;
  const raw = buildRawEntry(dateKey, entries);

  console.error(`Polishing ${formatDateHeading(dateKey)}...`);
  const polished = await polishWithClaude(raw);

  console.error('\n--- Claude output ---');
  console.error(polished);
  console.error('--- end ---\n');

  console.error('Inserting into changelog...');
  await insertEntry(polished);

  console.error('Committing...');
  await commitWithDate(dateKey);

  console.error(`Done: ${formatDateHeading(dateKey)}\n`);
}

console.error(`All ${sortedDates.length} entries committed.`);
