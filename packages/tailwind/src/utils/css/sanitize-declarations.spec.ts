import postcss from 'postcss';
import { sanitizeDeclarations } from './sanitize-declarations';

describe('sanitizeDeclarations', () => {
  describe('oklch to rgb conversion', () => {
    it('converts oklch to rgb without alpha', () => {
      const css = postcss.parse('div { color: oklch(50 0.2 180); }');
      const result = sanitizeDeclarations(css);
      expect(result).toBe('div { color: rgb(0.3, 0.5, 0.5, 1); }');
    });

    it('converts oklch to rgb with alpha', () => {
      const css = postcss.parse('div { color: oklch(75 0.15 90 / 0.8); }');
      const result = sanitizeDeclarations(css);
      expect(result).toBe('div { color: rgb(0.75, 0.9, 0.75, 0.8); }');
    });

    it('converts oklch with decimal values', () => {
      const css = postcss.parse('div { color: oklch(62.5 0.25 270 / 0.5); }');
      const result = sanitizeDeclarations(css);
      // 270 degrees = 3π/2, cos(3π/2) = 0, sin(3π/2) = -1
      // l = 0.625, c = 0.25, h = 270°
      // r = 0.625 + 0.25 * 0 = 0.625
      // g = 0.625 + 0.25 * (-1) = 0.375
      // b = 0.625
      expect(result).toBe('div { color: rgb(0.625, 0.375, 0.625, 0.5); }');
    });

    it('converts oklch with zero hue', () => {
      const css = postcss.parse('div { color: oklch(50 0.2 0); }');
      const result = sanitizeDeclarations(css);
      expect(result).toBe('div { color: rgb(0.7, 0.5, 0.5, 1); }');
    });

    it('converts oklch with 360 degree hue', () => {
      const css = postcss.parse('div { color: oklch(50 0.2 360); }');
      const result = sanitizeDeclarations(css);
      expect(result).toBe(
        'div { color: rgb(0.7, 0.49999999999999994, 0.5, 1); }',
      );
    });

    it('converts oklch with high chroma value', () => {
      const css = postcss.parse('div { color: oklch(80 0.4 45); }');
      const result = sanitizeDeclarations(css);
      expect(result).toBe(
        'div { color: rgb(1.0828427124746192, 1.0828427124746192, 0.8, 1); }',
      );
    });
  });

  describe('rgba space syntax to comma syntax conversion', () => {
    it('converts rgb with space syntax to comma syntax', () => {
      const css = postcss.parse('div { color: rgb(255 0 128); }');
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(255,0,128); }');
    });

    it('converts rgb with space syntax and alpha to comma syntax', () => {
      const css = postcss.parse('div { color: rgb(255 0 128 / 0.5); }');
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(255,0,128,0.5); }');
    });

    it('converts rgb with space syntax and percentage alpha', () => {
      const css = postcss.parse('div { color: rgb(255 0 128 / 50%); }');
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(255,0,128,50%); }');
    });

    it('converts rgb with alpha value of 1 (omits alpha)', () => {
      const css = postcss.parse('div { color: rgb(255 0 128 / 1); }');
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(255,0,128); }');
    });

    it('handles multiple rgb values in single declaration', () => {
      const css = postcss.parse(
        'div { background: linear-gradient(rgb(255 0 0), rgb(0 255 0 / 0.8)); }',
      );
      sanitizeDeclarations(css);
      expect(css.toString()).toBe(
        'div { background: linear-gradient(rgb(255,0,0), rgb(0,255,0,0.8)); }',
      );
    });

    it('handles rgb values with extra whitespace', () => {
      const css = postcss.parse(
        'div { color: rgb(  255   0   128  /  0.7  ); }',
      );
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(255,0,128,0.7); }');
    });

    it('handles zero values', () => {
      const css = postcss.parse('div { color: rgb(0 0 0); }');
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(0,0,0); }');
    });

    it('preserves already comma-separated rgb values', () => {
      const css = postcss.parse('div { color: rgb(255, 0, 128); }');
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(255, 0, 128); }');
    });
  });

  describe('complex scenarios', () => {
    it('handles multiple declarations with different rgb formats', () => {
      const css = postcss.parse(`
        div {
          color: rgb(255 0 128 / 0.5);
          background-color: rgb(0 255 0);
          border-color: rgb(128, 128, 128);
        }
      `);
      sanitizeDeclarations(css);
      const result = css.toString();
      expect(result).toContain('color: rgb(255,0,128,0.5)');
      expect(result).toContain('background-color: rgb(0,255,0)');
      expect(result).toContain('border-color: rgb(128, 128, 128)');
    });

    it('handles nested rules', () => {
      const css = postcss.parse(`
        @media (min-width: 768px) {
          div { color: rgb(255 0 128 / 0.8); }
        }
      `);
      sanitizeDeclarations(css);
      expect(css.toString()).toContain('color: rgb(255,0,128,0.8)');
    });

    it('processes at-rule declarations', () => {
      const css = postcss.parse(`
        @keyframes fade {
          from { background: rgb(255 0 0 / 0); }
          to { background: rgb(255 0 0 / 1); }
        }
      `);
      sanitizeDeclarations(css);
      const result = css.toString();
      expect(result).toBe(`
        @keyframes fade {
          from { background: rgb(255,0,0,0); }
          to { background: rgb(255,0,0); }
        }
      `);
    });
  });
});
