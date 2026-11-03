import {
  convert,
  type HtmlToTextOptions,
  type SelectorDefinition,
} from 'html-to-text';

export const plainTextSelectors: SelectorDefinition[] = [
  { selector: 'img', format: 'skip' },
  { selector: '[data-skip-in-text=true]', format: 'skip' },
  {
    selector: 'a',
    options: { linkBrackets: false, hideLinkHrefIfSameAsText: true },
  },
  { selector: '[data-text-format="dataTable"]', format: 'dataTable' },
  // One line per cell: html-to-text treats td/th as inline, so adjacent
  // cells (`<td>A</td><td>B</td>`) came out glued together as `AB`. A
  // layout table separates the things it holds, so the cells must not.
  // A caller's own `{ selector: 'td', format: 'inline' }` still wins: user
  // selectors are appended after these defaults.
  {
    selector: 'td',
    format: 'block',
    options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
  },
  {
    selector: 'th',
    format: 'block',
    options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
  },
];

export function toPlainText(html: string, options?: HtmlToTextOptions) {
  return convert(html, {
    wordwrap: false,
    ...options,
    selectors: [...plainTextSelectors, ...(options?.selectors ?? [])],
  });
}
