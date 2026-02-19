#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DOCS_CHANGELOG = join(ROOT, 'apps/docs/changelog.mdx');

const displayNames: Record<string, string> = {
  'react-email': 'React Email',
  'preview-server': 'Preview Server',
  components: 'Components',
  tailwind: 'Tailwind',
  render: 'Render',
  body: 'Body',
  button: 'Button',
  'code-block': 'Code Block',
  'code-inline': 'Code Inline',
  markdown: 'Markdown',
  'create-email': 'Create Email',
  editor: 'Editor',
  font: 'Font',
  head: 'Head',
  heading: 'Heading',
  hr: 'Hr',
  html: 'Html',
  img: 'Img',
  link: 'Link',
  preview: 'Preview',
  row: 'Row',
  section: 'Section',
  code_block: 'Code Block',
  code_inline: 'Code Inline',
  container: 'Container',
  column: 'Column',
  text: 'Text',
};

export function displayName(pkg: string): string {
  return (
    displayNames[pkg] ??
    pkg
      .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
      .replace(/^./, (c) => c.toUpperCase())
  );
}

export interface ChangelogVersion {
  version: string;
  bullets: string[];
}

export function parseChangelog(content: string): ChangelogVersion[] {
  const versions: ChangelogVersion[] = [];
  const lines = content.split('\n');
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^##\s+(.+?)(?:\s|$)/);
    if (m) {
      const rawVersion = m[1].trim();
      if (rawVersion.includes('-canary')) {
        i++;
        continue;
      }
      const bullets: string[] = [];
      i++;
      while (i < lines.length && !lines[i].match(/^##\s+/)) {
        if (lines[i].match(/^###\s+/)) {
          i++;
          continue;
        }
        const bullet = lines[i].match(/^-\s+(.+)$/);
        if (bullet) {
          let text = bullet[1].trim();
          text = text.replace(/^[0-9a-f]{7,}\s*:\s*/i, '');
          text = text.replace(/\s*\[[0-9a-f]{7,}\]\s*$/i, '');
          if (text) bullets.push(text);
        }
        i++;
      }
      versions.push({ version: rawVersion, bullets });
      continue;
    }
    i++;
  }
  return versions;
}

export interface TagDateResult {
  dateKey: string;
  header: string;
}

/** Accepts execSync or a test double that returns a string (e.g. ISO date). */
export type ExecSyncLike = (
  command: string,
  options?: { cwd?: string; encoding: 'utf-8' },
) => string;

export function getTagDate(
  tag: string,
  _root: string = ROOT,
  _execSync: ExecSyncLike = execSync as unknown as ExecSyncLike,
): TagDateResult | null {
  try {
    const out = _execSync(`git log -1 --format="%ci" "${tag}"`, {
      cwd: _root,
      encoding: 'utf-8',
    }).trim();
    if (!out) return null;
    const datePart = out.split(' ')[0];
    if (!datePart) return null;
    const [y, m, d] = datePart.split('-').map(Number);
    const months =
      'January,February,March,April,May,June,July,August,September,October,November,December'.split(
        ',',
      );
    return { dateKey: datePart, header: `${months[m - 1]} ${d}, ${y}` };
  } catch {
    return null;
  }
}

export function getTagForPackage(pkgDir: string, version: string): string {
  if (pkgDir === 'react-email') return `react-email@${version}`;
  if (pkgDir === 'create-email') return `create-email@${version}`;
  return `@react-email/${pkgDir}@${version}`;
}

export function alreadyInDocs(
  content: string,
  name: string,
  version: string,
): boolean {
  const re1 = new RegExp(
    `\\*\\*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+${version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\*\\*`,
    'i',
  );
  const re2 = new RegExp(
    `\\*\\*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+\`${version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\`\\s*\\*\\*`,
    'i',
  );
  return re1.test(content) || re2.test(content);
}

const ORDER: string[] = [
  'React Email',
  'Preview Server',
  'Create Email',
  'Components',
  'Tailwind',
  'Render',
  'Markdown',
  'Body',
  'Button',
  'Code Block',
  'Code Inline',
  'Column',
  'Container',
  'Font',
  'Head',
  'Heading',
  'Hr',
  'Html',
  'Img',
  'Link',
  'Preview',
  'Row',
  'Section',
  'Text',
  'Editor',
];

export interface ChangelogEntry {
  name: string;
  version: string;
  bullets: string[];
}

export function entryOrder(
  a: Pick<ChangelogEntry, 'name'>,
  b: Pick<ChangelogEntry, 'name'>,
): number {
  const i = ORDER.indexOf(a.name);
  const j = ORDER.indexOf(b.name);
  if (i !== -1 && j !== -1) return i - j;
  if (i !== -1) return -1;
  if (j !== -1) return 1;
  return (a.name || '').localeCompare(b.name || '');
}

export function cleanBullets(bullets: string[]): string[] {
  return bullets
    .filter((b) => b !== '(no changelog bullets)')
    .map((b) => b.replace(/^\s*-\s*/, '').trim())
    .filter((s): s is string => Boolean(s));
}

export function toMdxBlock(entry: ChangelogEntry): string {
  const bullets = cleanBullets(entry.bullets);
  const lines = [`**${entry.name} ${entry.version}**`, ''];
  if (bullets.length) {
    bullets.forEach((b) => {
      lines.push(`- ${b}`);
    });
  } else {
    lines.push('- (no release notes)');
  }
  return lines.join('\n');
}

export interface DateSectionData {
  header: string;
  entries: ChangelogEntry[];
}

export function toMdxSection(dateKey: string, data: DateSectionData): string {
  const entries = [...data.entries].sort(entryOrder);
  const blocks = entries.map(toMdxBlock).join('\n\n');
  return `## ${data.header}\n\n${blocks}`;
}

const MONTH_NAMES: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

export function dateHeaderToKey(header: string): string | null {
  const m = header
    .replace(/^##\s*/, '')
    .trim()
    .match(/(\w+)\s+(\d+),?\s*(\d{4})/i);
  if (!m) return null;
  const mon = MONTH_NAMES[m[1].toLowerCase()];
  if (mon == null) return null;
  const d = String(Number(m[2])).padStart(2, '0');
  return `${m[3]}-${String(mon).padStart(2, '0')}-${d}`;
}

const changelogPaths: string[] = [
  'packages/body/CHANGELOG.md',
  'packages/button/CHANGELOG.md',
  'packages/code-block/CHANGELOG.md',
  'packages/code-inline/CHANGELOG.md',
  'packages/column/CHANGELOG.md',
  'packages/components/CHANGELOG.md',
  'packages/container/CHANGELOG.md',
  'packages/create-email/CHANGELOG.md',
  'packages/editor/CHANGELOG.md',
  'packages/font/CHANGELOG.md',
  'packages/head/CHANGELOG.md',
  'packages/heading/CHANGELOG.md',
  'packages/hr/CHANGELOG.md',
  'packages/html/CHANGELOG.md',
  'packages/img/CHANGELOG.md',
  'packages/link/CHANGELOG.md',
  'packages/markdown/CHANGELOG.md',
  'packages/preview/CHANGELOG.md',
  'packages/preview-server/CHANGELOG.md',
  'packages/react-email/CHANGELOG.md',
  'packages/render/CHANGELOG.md',
  'packages/row/CHANGELOG.md',
  'packages/section/CHANGELOG.md',
  'packages/tailwind/CHANGELOG.md',
  'packages/text/CHANGELOG.md',
];

function run(): void {
  const docsContent = readFileSync(DOCS_CHANGELOG, 'utf-8');
  const byDate = new Map<string, DateSectionData>();
  for (const relPath of changelogPaths) {
    const fullPath = join(ROOT, relPath);
    if (!existsSync(fullPath)) continue;
    const content = readFileSync(fullPath, 'utf-8');
    const pkgDir = relPath.split('/')[1];
    if (!pkgDir) continue;
    const name = displayName(pkgDir);
    const versions = parseChangelog(content);
    for (const { version, bullets } of versions) {
      if (alreadyInDocs(docsContent, name, version)) continue;
      const tag = getTagForPackage(pkgDir, version);
      const dateInfo = getTagDate(tag);
      if (!dateInfo) continue;
      const existing = byDate.get(dateInfo.dateKey);
      if (existing) {
        existing.entries.push({
          name,
          version,
          bullets: bullets.length ? bullets : ['(no changelog bullets)'],
        });
      } else {
        byDate.set(dateInfo.dateKey, {
          header: dateInfo.header,
          entries: [
            {
              name,
              version,
              bullets: bullets.length ? bullets : ['(no changelog bullets)'],
            },
          ],
        });
      }
    }
  }
  const sortedDates = Array.from(byDate.entries()).sort((a, b) =>
    b[0].localeCompare(a[0]),
  );
  const mdxSections = sortedDates.map(([dateKey, data]) =>
    toMdxSection(dateKey, data),
  );
  const mdxByDate: Record<string, string> = Object.fromEntries(
    sortedDates.map(([k, v]) => [k, toMdxSection(k, v)]),
  );

  if (process.argv[2] === '--apply') {
    const existing = readFileSync(DOCS_CHANGELOG, 'utf-8');
    const parts = existing.split(/\n(?=## )/);
    const frontmatter = parts[0].includes('---') ? `${parts[0]}\n\n}` : '';
    const existingSections = parts[0].includes('---') ? parts.slice(1) : parts;
    const sectionsWithContent: {
      key: string | null;
      header: string;
      content: string;
    }[] = existingSections.map((block) => {
      const firstLine = block
        .split('\n')[0]
        .replace(/^##\s*/, '')
        .trim();
      const key = dateHeaderToKey(firstLine);
      return { key, header: firstLine, content: block };
    });
    const newDateKeys = sortedDates.map(([k]) => k);
    const toInsert: { dateKey: string; mdx: string }[] = [];
    for (const dateKey of newDateKeys) {
      const mdx = mdxByDate[dateKey];
      if (!mdx) continue;
      const existingIdx = sectionsWithContent.findIndex(
        (s) => s.key === dateKey,
      );
      if (existingIdx >= 0) {
        const entryBlock = mdx.replace(/^## [^\n]+\n\n/, '');
        sectionsWithContent[existingIdx].content =
          sectionsWithContent[existingIdx].content.trimEnd() +
          '\n\n' +
          entryBlock;
      } else {
        toInsert.push({ dateKey, mdx });
      }
    }
    const allSections: { dateKey: string; content: string }[] = [
      ...toInsert.map(({ dateKey, mdx }) => ({ dateKey, content: mdx.trim() })),
      ...sectionsWithContent
        .filter(
          (s): s is { key: string; header: string; content: string } =>
            s.key != null,
        )
        .map((s) => ({ dateKey: s.key, content: s.content })),
    ];
    allSections.sort((a, b) => b.dateKey.localeCompare(a.dateKey));
    const out = frontmatter + allSections.map((s) => s.content).join('\n\n');
    writeFileSync(DOCS_CHANGELOG, out);
    console.error(
      'Applied: added',
      toInsert.length,
      'new sections, merged into existing sections. Total sections:',
      allSections.length,
    );
  } else {
    console.log(
      JSON.stringify(
        {
          byDate: Object.fromEntries(sortedDates.map(([k, v]) => [k, v])),
          mdxSections,
          mdxByDate,
        },
        null,
        2,
      ),
    );
  }
}

const isMain = process.argv[1]?.includes('sync-changelog-to-docs');
if (isMain) {
  run();
}
