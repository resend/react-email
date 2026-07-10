import { parseCssInJsToInlineCss } from './parse-css-in-js-to-inline-css.js';

describe('parseCssInJsToInlineCss', () => {
  it('returns an empty string for undefined styles', () => {
    expect(parseCssInJsToInlineCss(undefined)).toBe('');
  });

  it('converts camelCase properties to kebab-case', () => {
    expect(parseCssInJsToInlineCss({ fontFamily: 'serif' })).toBe(
      'font-family:serif',
    );
  });

  it('appends px to numeric values of numerical properties', () => {
    expect(parseCssInJsToInlineCss({ fontSize: 16 })).toBe('font-size:16px');
  });

  it('joins multiple declarations with a semicolon', () => {
    expect(parseCssInJsToInlineCss({ color: 'red', fontSize: 16 })).toBe(
      'color:red;font-size:16px',
    );
  });

  it('escapes double quotes so they do not break the style attribute', () => {
    const result = parseCssInJsToInlineCss({
      fontFamily: '"Times New Roman", serif',
    });

    expect(result).toBe('font-family:&quot;Times New Roman&quot;, serif');
    expect(result).not.toContain('"');
  });

  it('does not corrupt double-quoted values into apostrophes', () => {
    const result = parseCssInJsToInlineCss({
      fontFamily: '"Times New Roman", serif',
    });

    // `&#x27;` is the apostrophe entity and would silently change the
    // quoted font name; a double quote must be escaped as `&quot;`.
    expect(result).not.toContain('&#x27;');
  });
});
