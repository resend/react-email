import { render } from '@react-email/render';
import { CodeBlock } from './index.js';
import type { PrismLanguage } from './languages-available.js';
import { Prism } from './prism.js';
import { dracula } from './themes.js';

const INVISIBLE_CHARACTERS = /\u00A0|\u200B|\u200C|\u200D|\u2060|\uFEFF/;

const allLanguages = Object.keys(Prism.languages).filter(
  (key) => typeof Prism.languages[key] === 'object',
) as PrismLanguage[];

const samples = [
  'npm install resend',
  'npx create-email@latest && cd react-email-starter',
  "import { Resend } from 'resend';\n\nconst resend = new Resend('re_123');\n\nawait resend.emails.send({\n  from: 'Acme <onboarding@resend.dev>',\n  to: ['delivered@resend.dev'],\n});",
  'def add(a, b):\n    if a > b:\n        return a + b\n    return  b',
  '<div class="a">\n  <p>Hello   world</p>\n</div>',
  'SELECT id, name\n  FROM users\n WHERE id = 1;',
  'func main() {\n\tfmt.Println("tab indented")\n}',
  'key: value\nlist:\n  - one\n  - two',
  'trailing spaces   \n   \n\tmixed \t tabs\t\n',
];

const parse = (html: string) => {
  const pre = new DOMParser()
    .parseFromString(html, 'text/html')
    .querySelector('pre');
  if (!pre) throw new Error('no <pre> rendered');
  return pre;
};

const textOf = (pre: Element) => {
  const clone = pre.cloneNode(true) as Element;
  for (const br of clone.querySelectorAll('br')) {
    br.replaceWith('\n');
  }
  return clone.textContent;
};

const isWhitespaceOnly = (text: string) => /^\s+$/.test(text);

const renderCode = (code: string, language: PrismLanguage) =>
  render(<CodeBlock code={code} language={language} theme={dracula} />);

describe('<CodeBlock> component', () => {
  it('renders `npm install resend` with plain spaces', async () => {
    const html = await renderCode('npm install resend', 'bash');

    expect(html).not.toMatch(INVISIBLE_CHARACTERS);
    expect(textOf(parse(html))).toBe('npm install resend\n');
  });

  it.each(
    allLanguages,
  )('keeps the exact source text in %s, so copied code still runs', async (language) => {
    for (const code of samples) {
      const html = await renderCode(code, language);

      expect(html).not.toMatch(INVISIBLE_CHARACTERS);
      expect(textOf(parse(html))).toBe(`${code}\n`);
    }
  });

  // Spark Mail drops `<span>` elements that only contain whitespace (#2631).
  it.each(
    allLanguages,
  )('renders no whitespace-only <span> in %s, so Spark Mail keeps every space', async (language) => {
    for (const code of samples) {
      const pre = parse(await renderCode(code, language));

      const whitespaceOnlySpans = [...pre.querySelectorAll('span')].filter(
        (span) => isWhitespaceOnly(span.textContent ?? ''),
      );
      for (const span of whitespaceOnlySpans) {
        // The only exception is a line that is all whitespace.
        expect([undefined, 'BR']).toContain(span.previousSibling?.nodeName);
        expect(span.nextSibling?.nodeName).toBe('BR');
      }

      for (const span of whitespaceOnlySpans) {
        span.remove();
      }
      const expected = code
        .split('\n')
        .map((line) => (isWhitespaceOnly(line) ? '' : line))
        .join('\n');
      expect(textOf(pre)).toBe(`${expected}\n`);
    }
  });
});
