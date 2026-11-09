import { toPlainText } from './to-plain-text';
import { unstableToPlainText } from './unstable-to-plain-text';

describe('toPlainTextUnstable', () => {
  it('skips images by default', () => {
    const html =
      '<p>Hello</p><img src="test.jpg" alt="Test Image"><p>World</p>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('inserts line breaks for text in between paragraphs too', () => {
    const html = '<p>He</p>ll<p>o</p>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('does not separate inline tags inside a block', () => {
    const html = '<p>He<b>ll</b>o</p>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('skips elements with data-skip-in-text="true"', () => {
    const html =
      '<p>Visible</p><span data-skip-in-text="true">Hidden</span><p>Also visible</p>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('formats links without brackets', () => {
    const html = '<a href="https://example.com">Click here</a>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('hides link href if same as text', () => {
    const html = '<a href="https://example.com">https://example.com</a>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('drops <head> content, including <style>, from the output', () => {
    // React always renders a real <head>/<body> for a full email document,
    // and Tailwind/global CSS ends up as a <style> tag inside it — this
    // must never leak into plain text as raw CSS.
    const html =
      '<html><head><style>.foo { color: red; }</style><title>Subject</title></head><body><p>Hello world</p></body></html>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('preserves heading case and separates every block with one blank line', () => {
    // Intentional deviations from toPlainText: html-to-text uppercases
    // headings, which destroys casing ("iPhone" → "IPHONE") and trips
    // all-caps spam heuristics; and it varies separation per tag (div 1
    // newline, p 2), so spacing depends on which element a component
    // happens to render. Headings keep their extra leading break.
    const html = '<h1>Title</h1><p>Body text</p><div>One</div><div>Two</div>';
    const result = unstableToPlainText(html);

    expect(result).toBe('Title\n\nBody text\n\nOne\n\nTwo');
  });

  it('renders nested unordered lists with indentation', () => {
    const html =
      '<ul><li>One<ul><li>Nested A</li><li>Nested B</li></ul></li><li>Two</li></ul>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('numbers ordered lists, honoring a start offset', () => {
    const html = '<ol start="5"><li>One</li><li>Two</li></ol>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('defaults empty or malformed ordered list starts to 1', () => {
    for (const start of ['', 'invalid']) {
      const html = `<ol start="${start}"><li>One</li><li>Two</li></ol>`;

      expect(unstableToPlainText(html)).toBe(' 1. One\n 2. Two');
    }
  });

  it('has no separation between table cells, matching the current default', () => {
    // Not "fixed" here on purpose: react-email's own Row/Column/Section
    // render as tables, and this is what toPlainText already does today.
    const html =
      '<table><tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></table>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('separates a nested table from its siblings inside the same cell', () => {
    const html =
      '<table><tr>' +
      '<td><table><tr><td>Col A</td></tr></table></td>' +
      '<td><table><tr><td>Col B</td></tr></table></td>' +
      '</tr></table>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('quotes blockquote content and draw a horizontal rule', () => {
    const html = '<blockquote>Quoted text</blockquote><hr><p>After</p>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('does not wrap long lines — toPlainText sets wordwrap: false', () => {
    // html-to-text wraps at 80 columns by default, but toPlainText turns
    // that off, so long paragraphs and long URLs stay on one line.
    for (const html of [
      '<p>The quick brown fox jumps over the lazy dog and then keeps on running through the quiet green field until sunset.</p>',
      '<p>see https://example.com/a/very/long/path/that/never/ever/ends/and/keeps/going/forever/and/ever okay</p>',
    ]) {
      expect(unstableToPlainText(html)).toBe(toPlainText(html));
    }
  });

  it('prefixes long blockquote content without wrapping it', () => {
    const html =
      '<blockquote>The quick brown fox jumps over the lazy dog and then keeps on running through the quiet green field until sunset.</blockquote>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('stacks <br> breaks additively on top of block separation', () => {
    // <br> is a hard break: "a<br><br>b" is two newlines (added, not
    // maxed), and it stacks on top of the surrounding blocks' separation.
    for (const html of ['a<br>b<br><br>c', '<p>a<br></p><p>b</p>']) {
      expect(unstableToPlainText(html)).toBe(toPlainText(html));
    }
  });

  it('keeps <br> breaks at the start and end of the output', () => {
    // Unlike block separation, hard breaks survive at the output's edges.
    for (const html of ['<p><br>a</p>', 'a<br>', '<p><br><br>a</p>']) {
      expect(unstableToPlainText(html)).toBe(toPlainText(html));
    }
  });

  it('commits breaks from empty blocks between content', () => {
    for (const html of ['<p>A</p><p></p><p>B</p>', 'A<div><p></p></div>B']) {
      expect(unstableToPlainText(html)).toBe(toPlainText(html));
    }
  });

  it('suppresses the href of fragment-only links', () => {
    const html = '<a href="#section">jump</a>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('renders anchors without an href as plain text', () => {
    const html = '<a>bare</a>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('strips the mailto: scheme from link hrefs', () => {
    const html = '<a href="mailto:x@y.com">mail me</a>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('preserves whitespace inside <pre>', () => {
    const html = '<pre>line  one\n  indented</pre>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('collapses zero-width spaces like whitespace', () => {
    const html = '<p>a​​b</p>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('preserves non-breaking spaces verbatim', () => {
    const html = '<p>a&nbsp;&nbsp;b</p>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('runs th and caption together with cells, like td', () => {
    const html =
      '<table><caption>Cap</caption><tr><th>H</th><td>D</td></tr></table>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('runs definition lists together', () => {
    const html = '<dl><dt>Term</dt><dd>Def</dd></dl>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });

  it('renders <wbr> as nothing', () => {
    const html = '<p>side<wbr>walk</p>';
    const result = unstableToPlainText(html);

    expect(result).toBe(toPlainText(html));
  });
});
