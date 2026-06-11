import { parseCssInJsToInlineCss } from './parse-css-in-js-to-inline-css.js';

describe('parseCssInJsToInlineCss', () => {
  it('returns an empty string for undefined input', () => {
    expect(parseCssInJsToInlineCss(undefined)).toBe('');
  });

  it('appends px to numerical properties', () => {
    expect(parseCssInJsToInlineCss({ fontSize: 16 })).toBe('font-size:16px');
  });

  it('escapes double quotes with the &quot; entity so the style attribute stays valid', () => {
    expect(
      parseCssInJsToInlineCss({ fontFamily: '"Times New Roman", serif' }),
    ).toBe('font-family:&quot;Times New Roman&quot;, serif');
  });
});
