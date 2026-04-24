import { describe, expect, it } from 'vitest';
import {
  createTheme,
  extendTheme,
  isThemeConfig,
  parseCssValue,
  themeStylesToPanelOverrides,
} from './theme-config';
import { EDITOR_THEMES, RESET_THEMES } from './themes';
import type { EditorTheme } from './types';

describe('parseCssValue', () => {
  it('parses pixel strings', () => {
    expect(parseCssValue('32px')).toEqual({ value: 32, unit: 'px' });
  });

  it('parses percentage strings', () => {
    expect(parseCssValue('155%')).toEqual({ value: 155, unit: '%' });
  });

  it('passes plain numbers through without unit', () => {
    expect(parseCssValue(600)).toEqual({ value: 600 });
  });

  it('parses color strings without unit', () => {
    expect(parseCssValue('#0670DB')).toEqual({ value: '#0670DB' });
  });

  it('parses keyword strings without unit', () => {
    expect(parseCssValue('underline')).toEqual({ value: 'underline' });
  });

  it('parses zero as px string', () => {
    expect(parseCssValue('0px')).toEqual({ value: 0, unit: 'px' });
  });

  it('parses decimal pixel values', () => {
    expect(parseCssValue('1.5px')).toEqual({ value: 1.5, unit: 'px' });
  });

  it('parses decimal percentage values', () => {
    expect(parseCssValue('12.5%')).toEqual({ value: 12.5, unit: '%' });
  });
});

describe('isThemeConfig', () => {
  it('returns false for string theme "basic"', () => {
    expect(isThemeConfig('basic')).toBe(false);
  });

  it('returns false for string theme "minimal"', () => {
    expect(isThemeConfig('minimal')).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isThemeConfig(undefined)).toBe(false);
  });

  it('returns true for object with styles property', () => {
    expect(isThemeConfig({ styles: {} })).toBe(true);
  });

  it('returns true for object with extends and styles', () => {
    expect(
      isThemeConfig({
        extends: 'basic',
        styles: { body: { backgroundColor: '#ff0000' } },
      }),
    ).toBe(true);
  });
});

describe('themeStylesToPanelOverrides', () => {
  it('overrides body background on basic theme', () => {
    const base = EDITOR_THEMES.basic;
    const result = themeStylesToPanelOverrides(
      { body: { backgroundColor: '#ff0000' } },
      base,
    );
    const bodyGroup = result.find((g) => g.id === 'body');
    const bgInput = bodyGroup?.inputs.find(
      (i) => i.prop === 'backgroundColor' && i.classReference === 'body',
    );
    expect(bgInput?.value).toBe('#ff0000');
  });

  it('overrides button backgroundColor and borderRadius as px string', () => {
    const base = EDITOR_THEMES.basic;
    const result = themeStylesToPanelOverrides(
      { button: { backgroundColor: '#123456', borderRadius: '8px' } },
      base,
    );
    const buttonGroup = result.find((g) => g.id === 'button');
    const bgInput = buttonGroup?.inputs.find(
      (i) => i.prop === 'backgroundColor' && i.classReference === 'button',
    );
    const radiusInput = buttonGroup?.inputs.find(
      (i) => i.prop === 'borderRadius' && i.classReference === 'button',
    );
    expect(bgInput?.value).toBe('#123456');
    expect(radiusInput?.value).toBe(8);
    expect(radiusInput?.unit).toBe('px');
  });

  it('overrides link color', () => {
    const base = EDITOR_THEMES.basic;
    const result = themeStylesToPanelOverrides(
      { link: { color: '#abcdef' } },
      base,
    );
    const linkGroup = result.find((g) => g.id === 'link');
    const colorInput = linkGroup?.inputs.find(
      (i) => i.prop === 'color' && i.classReference === 'link',
    );
    expect(colorInput?.value).toBe('#abcdef');
  });

  it('preserves unmodified container width of 600', () => {
    const base = EDITOR_THEMES.basic;
    const result = themeStylesToPanelOverrides(
      { body: { backgroundColor: '#ff0000' } },
      base,
    );
    const containerGroup = result.find((g) => g.id === 'container');
    const widthInput = containerGroup?.inputs.find(
      (i) => i.prop === 'width' && i.classReference === 'container',
    );
    expect(widthInput?.value).toBe(600);
  });

  it('works with minimal theme base', () => {
    const base = EDITOR_THEMES.minimal;
    const result = themeStylesToPanelOverrides(
      { link: { color: '#ff0000' } },
      base,
    );
    const linkGroup = result.find((g) => g.id === 'link');
    const colorInput = linkGroup?.inputs.find(
      (i) => i.prop === 'color' && i.classReference === 'link',
    );
    expect(colorInput?.value).toBe('#ff0000');
  });

  it('adds new input when property does not exist in base panel (h1 color)', () => {
    const base = EDITOR_THEMES.basic;
    const result = themeStylesToPanelOverrides(
      { h1: { color: '#ff0000' } },
      base,
    );
    const h1Group = result.find((g) => g.id === 'h1');
    const colorInput = h1Group?.inputs.find(
      (i) => i.prop === 'color' && i.classReference === 'h1',
    );
    expect(colorInput?.value).toBe('#ff0000');
  });

  it('adds new input with parsed unit when property does not exist (h1 fontSize as "32px")', () => {
    const base = EDITOR_THEMES.basic;
    const result = themeStylesToPanelOverrides(
      { h1: { fontSize: '32px' } },
      base,
    );
    const h1Group = result.find((g) => g.id === 'h1');
    const fontSizeInput = h1Group?.inputs.find(
      (i) => i.prop === 'fontSize' && i.classReference === 'h1',
    );
    expect(fontSizeInput?.value).toBe(32);
    expect(fontSizeInput?.unit).toBe('px');
  });

  it('does not mutate base panels', () => {
    const base = EDITOR_THEMES.basic;
    const originalBodyBg = base
      .find((g) => g.id === 'body')
      ?.inputs.find((i) => i.prop === 'backgroundColor')?.value;
    themeStylesToPanelOverrides(
      { body: { backgroundColor: '#mutated' } },
      base,
    );
    const afterBodyBg = base
      .find((g) => g.id === 'body')
      ?.inputs.find((i) => i.prop === 'backgroundColor')?.value;
    expect(afterBodyBg).toBe(originalBodyBg);
  });
});

describe('createTheme', () => {
  it('returns ThemeConfig without extends', () => {
    const result = createTheme({ body: { backgroundColor: '#ff0000' } });
    expect(result).toEqual({
      styles: { body: { backgroundColor: '#ff0000' } },
    });
    expect(result.extends).toBeUndefined();
  });
});

describe('extendTheme', () => {
  it('returns ThemeConfig with extends set', () => {
    const result = extendTheme('basic', {
      body: { backgroundColor: '#ff0000' },
    });
    expect(result).toEqual({
      extends: 'basic',
      styles: { body: { backgroundColor: '#ff0000' } },
    });
  });

  it('works with minimal base', () => {
    const result = extendTheme('minimal', { link: { color: '#abc' } });
    expect(result.extends).toBe('minimal');
    expect(result.styles).toEqual({ link: { color: '#abc' } });
  });
});

describe('new design themes', () => {
  const DESIGN_THEMES = [
    'barebone',
    'matte',
    'protocol',
    'arcane',
    'studio',
  ] as const satisfies readonly EditorTheme[];

  const REQUIRED_PANEL_IDS = [
    'body',
    'container',
    'typography',
    'h1',
    'h2',
    'h3',
    'paragraph',
    'link',
    'image',
    'button',
    'code-block',
    'inline-code',
  ];

  for (const theme of DESIGN_THEMES) {
    it(`${theme} is registered in EDITOR_THEMES with all required panels`, () => {
      const panels = EDITOR_THEMES[theme];
      expect(panels).toBeDefined();
      const ids = panels.map((g) => g.id);
      for (const id of REQUIRED_PANEL_IDS) {
        expect(ids).toContain(id);
      }
    });

    it(`${theme} is registered in RESET_THEMES with heading styles`, () => {
      const reset = RESET_THEMES[theme];
      expect(reset).toBeDefined();
      expect(reset.h1.fontSize).toBeDefined();
      expect(reset.h2.fontSize).toBeDefined();
      expect(reset.h3.fontSize).toBeDefined();
      expect(reset.button.backgroundColor).toBeDefined();
      expect(reset.button.color).toBeDefined();
    });

    it(`${theme} can be used as extendTheme base`, () => {
      const result = extendTheme(theme, { link: { color: '#abc' } });
      expect(result.extends).toBe(theme);
    });
  }

  it('barebone has a light body background', () => {
    const bodyBg = EDITOR_THEMES.barebone
      .find((g) => g.id === 'body')
      ?.inputs.find((i) => i.prop === 'backgroundColor')?.value;
    expect(bodyBg).toBe('#F3F4F6');
  });

  it('protocol is a dark theme', () => {
    const containerBg = EDITOR_THEMES.protocol
      .find((g) => g.id === 'container')
      ?.inputs.find((i) => i.prop === 'backgroundColor')?.value;
    expect(containerBg).toBe('#131313');
  });

  it('arcane has a dark maroon container', () => {
    const containerBg = EDITOR_THEMES.arcane
      .find((g) => g.id === 'container')
      ?.inputs.find((i) => i.prop === 'backgroundColor')?.value;
    expect(containerBg).toBe('#300610');
  });
});
