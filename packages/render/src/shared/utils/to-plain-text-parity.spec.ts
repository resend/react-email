import { convert } from 'html-to-text';
import { plainTextSelectors, toPlainText } from './to-plain-text';

/**
 * The default conversion path no longer goes through `html-to-text` (#2961).
 * These cases pin the new implementation to the output of the old one for
 * email-realistic HTML, so the deprecated options path can be removed in the
 * next major without a behavior change for callers that never passed options.
 */
const legacyConvert = (html: string) =>
  convert(html, { wordwrap: false, selectors: plainTextSelectors });

const cases: Record<string, string> = {
  headings:
    '<h1>Welcome, Jim!</h1><p>Thanks for trying our product.</p><h2>Next steps</h2><p>Verify your email.</p>',
  'nested tables (Section/Row/Column output)':
    '<table><tbody><tr><td><table><tbody><tr><td><p>Inside a nested cell</p></td></tr></tbody></table></td></tr></tbody></table>',
  'link with different text':
    '<p>Click <a href="https://example.com/verify">here</a> to verify.</p>',
  'link with same text':
    '<p>Visit <a href="https://example.com">https://example.com</a> today.</p>',
  'skipped image': '<p>Before</p><img src="cat.jpg" alt="A cat"><p>After</p>',
  'skipped data attribute':
    '<p>Shown</p><span data-skip-in-text="true">Preview text</span><p>Also shown</p>',
  'line breaks': '<p>First line<br>Second line</p>',
  'whitespace collapsing':
    '<p>  Multiple   spaces\n\tand newlines  </p><p> Around blocks </p>',
  entities: '<p>Ampersand &amp; angle &lt;brackets&gt; and&nbsp;nbsp</p>',
  'full document':
    '<!DOCTYPE html><html><head><title>Ignored</title><style>p{color:red}</style></head><body><h1>Hello</h1><p>Body text.</p></body></html>',
};

describe('plain text parity with the deprecated html-to-text path', () => {
  for (const [name, html] of Object.entries(cases)) {
    it(name, () => {
      expect(toPlainText(html)).toBe(legacyConvert(html));
    });
  }
});
