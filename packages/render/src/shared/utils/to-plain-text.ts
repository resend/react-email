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
];

export function toPlainText(html: string, options?: HtmlToTextOptions) {
  return convert(html, {
    wordwrap: false,
    ...options,
    selectors: [...plainTextSelectors, ...(options?.selectors ?? [])],
  });
}
