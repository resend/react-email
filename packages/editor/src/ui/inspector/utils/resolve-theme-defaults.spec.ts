import { describe, expect, it } from 'vitest';
import type { KnownThemeComponents } from '../../../plugins/email-theming/types';
import {
  convertToInspectorUnit,
  normalizeInlineStyleUnits,
  parseCssValue,
  resolveThemeDefaults,
} from './resolve-theme-defaults';

describe('parseCssValue', () => {
  it('returns null for undefined', () => {
    expect(parseCssValue(undefined)).toBeNull();
  });

  it('parses bare numbers', () => {
    expect(parseCssValue(14)).toEqual({ numeric: 14, unit: '' });
    expect(parseCssValue(0)).toEqual({ numeric: 0, unit: '' });
  });

  it('parses px values', () => {
    expect(parseCssValue('16px')).toEqual({ numeric: 16, unit: 'px' });
  });

  it('parses em values', () => {
    expect(parseCssValue('2.25em')).toEqual({ numeric: 2.25, unit: 'em' });
  });

  it('parses rem values', () => {
    expect(parseCssValue('1.5rem')).toEqual({ numeric: 1.5, unit: 'rem' });
  });

  it('parses percentage values', () => {
    expect(parseCssValue('155%')).toEqual({ numeric: 155, unit: '%' });
  });

  it('parses string numbers without units', () => {
    expect(parseCssValue('400')).toEqual({ numeric: 400, unit: '' });
  });

  it('returns null for non-numeric strings', () => {
    expect(parseCssValue('underline')).toBeNull();
    expect(parseCssValue('#000000')).toBeNull();
    expect(parseCssValue('10px 20px')).toBeNull();
  });

  it('parses negative values', () => {
    expect(parseCssValue('-1.5em')).toEqual({ numeric: -1.5, unit: 'em' });
  });
});

describe('convertToInspectorUnit', () => {
  it('converts em to px using base font size', () => {
    expect(convertToInspectorUnit('2.25em', 16, 'px')).toBe(36);
    expect(convertToInspectorUnit('1.8em', 16, 'px')).toBe(29);
    expect(convertToInspectorUnit('1.4em', 16, 'px')).toBe(22);
  });

  it('converts rem to px using base font size', () => {
    expect(convertToInspectorUnit('1.5rem', 16, 'px')).toBe(24);
  });

  it('strips px unit and returns number', () => {
    expect(convertToInspectorUnit('16px', 16, 'px')).toBe(16);
  });

  it('passes through bare numbers', () => {
    expect(convertToInspectorUnit(400, 16, 'px')).toBe(400);
  });

  it('passes through percentage values', () => {
    expect(convertToInspectorUnit('155%', 16, '%')).toBe(155);
  });

  it('returns empty string for undefined', () => {
    expect(convertToInspectorUnit(undefined, 16, 'px')).toBe('');
  });

  it('returns empty string for non-parseable values', () => {
    expect(convertToInspectorUnit('underline', 16, 'px')).toBe('');
  });
});

describe('normalizeInlineStyleUnits', () => {
  it('converts em fontSize to px', () => {
    const result = normalizeInlineStyleUnits({ fontSize: '1.8em' });
    expect(result.fontSize).toBe('29');
  });

  it('converts rem fontSize to px', () => {
    const result = normalizeInlineStyleUnits({ fontSize: '1.5rem' });
    expect(result.fontSize).toBe('24');
  });

  it('converts em lineHeight to percentage', () => {
    const result = normalizeInlineStyleUnits({ lineHeight: '1.44em' });
    expect(result.lineHeight).toBe('144');
  });

  it('converts rem lineHeight to percentage', () => {
    const result = normalizeInlineStyleUnits({ lineHeight: '1.5rem' });
    expect(result.lineHeight).toBe('150');
  });

  it('passes through px fontSize unchanged', () => {
    const result = normalizeInlineStyleUnits({ fontSize: '16' });
    expect(result.fontSize).toBe('16');
  });

  it('passes through numeric lineHeight unchanged', () => {
    const result = normalizeInlineStyleUnits({ lineHeight: '144' });
    expect(result.lineHeight).toBe('144');
  });

  it('strips percent sign from lineHeight percentage values', () => {
    const result = normalizeInlineStyleUnits({ lineHeight: '155%' });
    expect(result.lineHeight).toBe('155');
  });

  it('converts both fontSize and lineHeight together', () => {
    const result = normalizeInlineStyleUnits({
      fontSize: '1.8em',
      lineHeight: '1.44em',
    });
    expect(result.fontSize).toBe('29');
    expect(result.lineHeight).toBe('144');
  });

  it('leaves unrelated properties untouched', () => {
    const result = normalizeInlineStyleUnits({
      fontSize: '1em',
      color: '#000000',
      paddingTop: '10px',
    });
    expect(result.color).toBe('#000000');
    expect(result.paddingTop).toBe('10px');
  });

  it('returns empty object unchanged', () => {
    expect(normalizeInlineStyleUnits({})).toEqual({});
  });
});

describe('resolveThemeDefaults', () => {
  const emptyTheme = {} as Record<KnownThemeComponents, React.CSSProperties>;

  const mockTheme = {
    body: { fontSize: '16px', color: '#000000', lineHeight: '155%' },
    h1: {
      fontSize: '2.25em',
      lineHeight: '1.44em',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.8em',
      lineHeight: '1.44em',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.4em',
      fontWeight: 600,
    },
    paragraph: { fontSize: '1em' },
    blockquote: { color: '#7e8a9a', fontSize: '1.1em' },
    button: { backgroundColor: '#000000', color: '#ffffff' },
    link: { textDecoration: 'underline' },
  } as Record<KnownThemeComponents, React.CSSProperties>;

  it('returns empty for unknown node types', () => {
    expect(resolveThemeDefaults('unknown', {}, mockTheme)).toEqual({});
  });

  it('returns empty when theme has no styles for the component', () => {
    expect(resolveThemeDefaults('paragraph', {}, emptyTheme)).toEqual({});
  });

  it('resolves H1 heading defaults (font-size and line-height are placeholder-only)', () => {
    const result = resolveThemeDefaults('heading', { level: 1 }, mockTheme);
    expect(result.fontWeight).toBe(600);
    expect(result).not.toHaveProperty('fontSize');
    expect(result).not.toHaveProperty('lineHeight');
  });

  it('resolves H2 heading defaults', () => {
    const result = resolveThemeDefaults('heading', { level: 2 }, mockTheme);
    expect(result.fontWeight).toBe(600);
    expect(result).not.toHaveProperty('fontSize');
  });

  it('resolves H3 heading defaults', () => {
    const result = resolveThemeDefaults('heading', { level: 3 }, mockTheme);
    expect(result.fontWeight).toBe(600);
    expect(result).not.toHaveProperty('fontSize');
  });

  it('returns null for unsupported heading levels', () => {
    expect(resolveThemeDefaults('heading', { level: 4 }, mockTheme)).toEqual(
      {},
    );
  });

  it('resolves paragraph defaults (font-size and line-height are placeholder-only)', () => {
    const result = resolveThemeDefaults('paragraph', {}, mockTheme);
    expect(result).not.toHaveProperty('fontSize');
    expect(result).not.toHaveProperty('lineHeight');
  });

  it('resolves blockquote color', () => {
    const result = resolveThemeDefaults('blockquote', {}, mockTheme);
    expect(result.color).toBe('#7e8a9a');
  });

  it('resolves button defaults', () => {
    const result = resolveThemeDefaults('button', {}, mockTheme);
    expect(result.backgroundColor).toBe('#000000');
    expect(result.color).toBe('#ffffff');
  });

  it('resolves textDecoration', () => {
    const theme = {
      ...mockTheme,
      paragraph: { textDecoration: 'underline' },
    } as Record<KnownThemeComponents, React.CSSProperties>;
    const result = resolveThemeDefaults('paragraph', {}, theme);
    expect(result.textDecoration).toBe('underline');
  });

  it('resolves border properties', () => {
    const theme = {
      ...mockTheme,
      button: {
        borderRadius: '8px',
        borderWidth: '2px',
        borderColor: '#333333',
        borderStyle: 'solid',
      },
    } as Record<KnownThemeComponents, React.CSSProperties>;
    const result = resolveThemeDefaults('button', {}, theme);
    expect(result.borderRadius).toBe(8);
    expect(result.borderWidth).toBe(2);
    expect(result.borderColor).toBe('#333333');
    expect(result.borderStyle).toBe('solid');
  });

  it('resolves individual padding properties', () => {
    const theme = {
      ...mockTheme,
      h1: { ...mockTheme.h1, paddingTop: '0.389em' },
    } as Record<KnownThemeComponents, React.CSSProperties>;
    const result = resolveThemeDefaults('heading', { level: 1 }, theme);
    expect(result.paddingTop).toBe(6);
  });

  it('resolves shorthand padding into individual properties', () => {
    const theme = {
      ...mockTheme,
      section: { padding: '10px 20px 10px 20px' },
    } as Record<KnownThemeComponents, React.CSSProperties>;
    const result = resolveThemeDefaults('section', {}, theme);
    expect(result.paddingTop).toBe(10);
    expect(result.paddingRight).toBe(20);
    expect(result.paddingBottom).toBe(10);
    expect(result.paddingLeft).toBe(20);
  });

  it('individual padding properties take priority over shorthand', () => {
    const theme = {
      ...mockTheme,
      section: { padding: '10px 20px', paddingTop: '5px' },
    } as Record<KnownThemeComponents, React.CSSProperties>;
    const result = resolveThemeDefaults('section', {}, theme);
    expect(result.paddingTop).toBe(5);
    expect(result.paddingRight).toBe(20);
    expect(result.paddingBottom).toBe(10);
    expect(result.paddingLeft).toBe(20);
  });
});
