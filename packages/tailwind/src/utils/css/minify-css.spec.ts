import { parse } from 'postcss';
import { minifyCss } from './minify-css';

describe('minifyCss', () => {
  it('should remove comments', () => {
    const input = parse('body { color: red; /* This is a comment */ }');
    const expected = 'body{color:red}';
    expect(minifyCss(input)).toBe(expected);
  });

  it('should remove extra spaces after semicolons and colons', () => {
    const input = parse('body { color: red;   font-size: 16px; }');
    const expected = 'body{color:red;font-size:16px}';
    expect(minifyCss(input)).toBe(expected);
  });

  it('should remove extra spaces before and after brackets', () => {
    const input = parse('body { color: red; } .class { margin: 10px; }');
    const expected = 'body{color:red}.class{margin:10px}';
    expect(minifyCss(input)).toBe(expected);
  });

  it('should handle multiple rules in a single string', () => {
    const input = parse('body { color: red; } .class { margin: 10px; }');
    const expected = 'body{color:red}.class{margin:10px}';
    expect(minifyCss(input)).toBe(expected);
  });

  // https://github.com/resend/react-email/issues/2297
  it('should handle at rules with multiple parameters', () => {
    const input = parse(`@media not all and (min-width:600px) {
  .max-desktop_px-40 {
    padding-left: 40px !important;
    padding-right: 40px !important
  }
}`);
    const expected =
      '@media not all and (min-width:600px){.max-desktop_px-40{padding-left:40px!important;padding-right:40px!important}}';
    expect(minifyCss(input)).toBe(expected);
  });

  it('should handle empty strings', () => {
    const input = parse('');
    const expected = '';
    expect(minifyCss(input)).toBe(expected);
  });
});
