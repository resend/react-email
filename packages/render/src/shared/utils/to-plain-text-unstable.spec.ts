import { toPlainText } from './to-plain-text';
import { toPlainTextUnstable } from './to-plain-text-unstable';

describe('toPlainTextUnstable', () => {
  it('skips images by default', async () => {
    const html =
      '<p>Hello</p><img src="test.jpg" alt="Test Image"><p>World</p>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('inserts line breaks for text in between paragraphs too', async () => {
    const html = '<p>He</p>ll<p>o</p>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('does not separate inline tags inside a block', async () => {
    const html = '<p>He<b>ll</b>o</p>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('skips elements with data-skip-in-text="true"', async () => {
    const html =
      '<p>Visible</p><span data-skip-in-text="true">Hidden</span><p>Also visible</p>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('formats links without brackets', async () => {
    const html = '<a href="https://example.com">Click here</a>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('hides link href if same as text', async () => {
    const html = '<a href="https://example.com">https://example.com</a>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('drops <head> content, including <style>, from the output', async () => {
    // React always renders a real <head>/<body> for a full email document,
    // and Tailwind/global CSS ends up as a <style> tag inside it — this
    // must never leak into plain text as raw CSS.
    const html =
      '<html><head><style>.foo { color: red; }</style><title>Subject</title></head><body><p>Hello world</p></body></html>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('sets headings uppercase and separate blocks like paragraphs and divs', async () => {
    const html = '<h1>Title</h1><p>Body text</p><div>One</div><div>Two</div>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('renders nested unordered lists with indentation', async () => {
    const html =
      '<ul><li>One<ul><li>Nested A</li><li>Nested B</li></ul></li><li>Two</li></ul>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('numbers ordered lists, honoring a start offset', async () => {
    const html = '<ol start="5"><li>One</li><li>Two</li></ol>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('has no separation between table cells, matching the current default', async () => {
    // Not "fixed" here on purpose: react-email's own Row/Column/Section
    // render as tables, and this is what toPlainText already does today.
    const html =
      '<table><tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></table>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('separates a nested table from its siblings inside the same cell', async () => {
    const html =
      '<table><tr>' +
      '<td><table><tr><td>Col A</td></tr></table></td>' +
      '<td><table><tr><td>Col B</td></tr></table></td>' +
      '</tr></table>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('quotes blockquote content and draw a horizontal rule', async () => {
    const html = '<blockquote>Quoted text</blockquote><hr><p>After</p>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('does not wrap long lines — toPlainText sets wordwrap: false', async () => {
    // html-to-text wraps at 80 columns by default, but toPlainText turns
    // that off, so long paragraphs and long URLs stay on one line.
    for (const html of [
      '<p>The quick brown fox jumps over the lazy dog and then keeps on running through the quiet green field until sunset.</p>',
      '<p>see https://example.com/a/very/long/path/that/never/ever/ends/and/keeps/going/forever/and/ever okay</p>',
    ]) {
      expect(await toPlainTextUnstable(html)).toBe(toPlainText(html));
    }
  });

  it('prefixes long blockquote content without wrapping it', async () => {
    const html =
      '<blockquote>The quick brown fox jumps over the lazy dog and then keeps on running through the quiet green field until sunset.</blockquote>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('stacks <br> breaks additively on top of block separation', async () => {
    // <br> is a hard break: "a<br><br>b" is two newlines (added, not
    // maxed), and it stacks on top of the surrounding blocks' separation.
    for (const html of ['a<br>b<br><br>c', '<p>a<br></p><p>b</p>']) {
      expect(await toPlainTextUnstable(html)).toBe(toPlainText(html));
    }
  });

  it('keeps <br> breaks at the start and end of the output', async () => {
    // Unlike block separation, hard breaks survive at the output's edges.
    for (const html of ['<p><br>a</p>', 'a<br>', '<p><br><br>a</p>']) {
      expect(await toPlainTextUnstable(html)).toBe(toPlainText(html));
    }
  });

  it('commits breaks from empty blocks between content', async () => {
    for (const html of [
      '<p>A</p><p></p><p>B</p>',
      'A<div><p></p></div>B',
    ]) {
      expect(await toPlainTextUnstable(html)).toBe(toPlainText(html));
    }
  });

  it('suppresses the href of fragment-only links', async () => {
    const html = '<a href="#section">jump</a>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('renders anchors without an href as plain text', async () => {
    const html = '<a>bare</a>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('strips the mailto: scheme from link hrefs', async () => {
    const html = '<a href="mailto:x@y.com">mail me</a>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('preserves whitespace inside <pre>', async () => {
    const html = '<pre>line  one\n  indented</pre>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('collapses zero-width spaces like whitespace', async () => {
    const html = '<p>a​​b</p>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('preserves non-breaking spaces verbatim', async () => {
    const html = '<p>a&nbsp;&nbsp;b</p>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('runs th and caption together with cells, like td', async () => {
    const html =
      '<table><caption>Cap</caption><tr><th>H</th><td>D</td></tr></table>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('runs definition lists together', async () => {
    const html = '<dl><dt>Term</dt><dd>Def</dd></dl>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });

  it('renders <wbr> as nothing', async () => {
    const html = '<p>side<wbr>walk</p>';
    const result = await toPlainTextUnstable(html);

    expect(result).toBe(toPlainText(html));
  });
});
