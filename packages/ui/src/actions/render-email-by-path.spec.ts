import path from 'node:path';
import { renderEmailByPath } from './render-email-by-path';

describe('renderEmailByPath() with raw .html templates', () => {
  const htmlPath = path.resolve(
    __dirname,
    '../utils/testing/raw-html-email.html',
  );

  it('renders raw HTML without bundling a React component', async () => {
    const result = await renderEmailByPath(htmlPath, true);

    expect('error' in result).toBe(false);
    if ('error' in result) return;

    expect(result.basename).toBe('raw-html-email');
    expect(result.extname).toBe('html');
    expect(result.markup).toContain('<h1>Hello from a raw HTML email</h1>');
    expect(result.reactMarkup).toContain(
      '<h1>Hello from a raw HTML email</h1>',
    );
    // The fixture ships as a single minified line; prettyMarkup should be
    // formatted across multiple lines so the source view is readable.
    expect(result.prettyMarkup).toContain('Hello from a raw HTML email');
    expect(result.prettyMarkup.split('\n').length).toBeGreaterThan(
      result.markup.split('\n').length,
    );
    // html-to-text uppercases <h1> content by default
    expect(result.plainText.toLowerCase()).toContain(
      'hello from a raw html email',
    );
    expect(result.plainText).toContain(
      'This template has no JavaScript exports.',
    );
  });
});
