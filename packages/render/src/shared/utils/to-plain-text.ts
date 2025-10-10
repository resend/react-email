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
];

export function toPlainText(html: string, options?: HtmlToTextOptions) {
  return convert(html, {
    selectors: plainTextSelectors,
    wordwrap: false,
    ...options,
  });
}
