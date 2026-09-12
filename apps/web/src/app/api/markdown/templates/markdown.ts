import {
  DEMO_EMAIL_PREVIEW_BASE_URL,
  GITHUB_BASE,
  type TemplateItem,
} from '../../../../components/template-list-data';

const GITHUB_FILE_BASE = GITHUB_BASE.replace('/tree/', '/blob/');

export const templateSourceUrl = (item: TemplateItem) =>
  item.github ??
  `${GITHUB_FILE_BASE}${item.href.slice(DEMO_EMAIL_PREVIEW_BASE_URL.length)}.tsx`;

const section = (title: string, items: TemplateItem[]) => {
  const lines = [`## ${title}`, ''];
  for (const item of items) {
    lines.push(`### ${item.name}`, '');
    if (item.author) {
      lines.push(`Author: ${item.author}`);
    }
    lines.push(`Preview: ${item.href}`);
    lines.push(`Source: ${templateSourceUrl(item)}`);
    if (item.figma) {
      lines.push(`Figma: ${item.figma}`);
    }
    lines.push('');
  }
  return lines;
};

export const templatesMarkdown = (
  official: TemplateItem[],
  community: TemplateItem[],
): string =>
  [
    '# React Email Templates',
    '',
    '> Open source email templates built with React Email. Each entry links to a live preview and to the source on GitHub.',
    '',
    'Web: https://react.email/templates',
    '',
    ...section('Official', official),
    ...section('Community', community),
  ].join('\n');
