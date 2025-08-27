import postcss from 'postcss';
import { sanitizeDeclarations } from './sanitize-declarations';

describe('sanitizeDeclarations', () => {
  describe('oklch to rgb conversion', () => {
    it('converts oklch to rgb without alpha', () => {
      const css = postcss.parse('div { color: oklch(90.5% 0.2 180); }');
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(0,255,228.7); }');
    });

    it('converts oklch to rgb with alpha', () => {
      const css = postcss.parse('div { color: oklch(96.6% 0.147 107 / 80%); }');
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(255,250.7,125.6,0.8); }');
    });

    it('converts oklch with decimal values', () => {
      const css = postcss.parse('div { color: oklch(92.6% 0.0546 218 / 50%); }');
      sanitizeDeclarations(css);
      // 270 degrees = 3π/2, cos(3π/2) = 0, sin(3π/2) = -1
      // l = 0.625, c = 0.25, h = 270°
      // r = 0.625 + 0.25 * 0 = 0.625
      // g = 0.625 + 0.25 * (-1) = 0.375
      // b = 0.625
      expect(css.toString()).toBe('div { color: rgb(190.5,240.2,255,0.5); }');
    });

    it('converts oklch with zero hue', () => {
      const css = postcss.parse('div { color: oklch(88.3% 0.102 329); }');
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(254.6,192.6,249.8); }');
    });

    it('converts oklch with 360 degree hue', () => {
      const css = postcss.parse('div { color: oklch(88.3% 0.102 329); }');
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(254.6,192.6,249.8); }');
    });

    it('converts oklch with high chroma value', () => {
      const css = postcss.parse('div { color: oklch(69.3% 0.206 42.8); }');
      sanitizeDeclarations(css);
      expect(css.toString()).toBe('div { color: rgb(255,99.8,0.1); }');
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
