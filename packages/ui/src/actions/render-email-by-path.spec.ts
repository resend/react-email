import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { renderEmailByPath } from './render-email-by-path';

describe('renderEmailByPath() with raw .html templates', () => {
  const emailsRoot = path.resolve(__dirname, '../utils/testing');
  const htmlPath = path.join(emailsRoot, 'raw-html-email.html');

  let previousEnvValue: string | undefined;

  beforeAll(() => {
    previousEnvValue =
      process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH;
    process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH = emailsRoot;
  });

  afterAll(() => {
    if (previousEnvValue === undefined) {
      delete process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH;
    } else {
      process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH =
        previousEnvValue;
    }
  });

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

  it('refuses to render a path outside the configured emails directory', async () => {
    const result = await renderEmailByPath('/etc/passwd', true);

    expect('error' in result).toBe(true);
    if (!('error' in result)) return;
    expect(result.error.message).toMatch(/outside of the configured emails/);
  });

  it('refuses to escape via traversal segments', async () => {
    const result = await renderEmailByPath(
      path.join(emailsRoot, '..', '..', '..', 'etc', 'passwd'),
      true,
    );

    expect('error' in result).toBe(true);
  });
});
