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
  { selector: '[data-text-format="inline"]', format: 'inline' },
  { selector: '[data-text-format="anchor"]', format: 'anchor' },
  { selector: '[data-text-format="block"]', format: 'block' },
  { selector: '[data-text-format="blockquote"]', format: 'blockquote' },
  { selector: '[data-text-format="lineBreak"]', format: 'lineBreak' },
  { selector: '[data-text-format="heading"]', format: 'heading' },
  { selector: '[data-text-format="horizontalLine"]', format: 'horizontalLine' },
  { selector: '[data-text-format="image"]', format: 'image' },
  { selector: '[data-text-format="orderedList"]', format: 'orderedList' },
  { selector: '[data-text-format="paragraph"]', format: 'paragraph' },
  { selector: '[data-text-format="pre"]', format: 'pre' },
  { selector: '[data-text-format="table"]', format: 'table' },
  { selector: '[data-text-format="unorderedList"]', format: 'unorderedList' },
  { selector: '[data-text-format="wbr"]', format: 'wbr' },
  { selector: '[data-text-format="dataTable"]', format: 'dataTable' },
  { selector: '[data-text-format="skip"]', format: 'skip' },
  { selector: '[data-text-format="blockString"]', format: 'blockString' },
  { selector: '[data-text-format="blockTag"]', format: 'blockTag' },
  { selector: '[data-text-format="blockHtml"]', format: 'blockHtml' },
  { selector: '[data-text-format="inlineString"]', format: 'inlineString' },
  { selector: '[data-text-format="inlineSurround"]', format: 'inlineSurround' },
  { selector: '[data-text-format="inlineTag"]', format: 'inlineTag' },
  { selector: '[data-text-format="inlineHtml"]', format: 'inlineHtml' },
];

export function toPlainText(html: string, options?: HtmlToTextOptions) {
  return convert(html, {
    wordwrap: false,
    ...options,
    selectors: [...plainTextSelectors, ...(options?.selectors ?? [])],
  });
}
