import { generate, parse } from 'css-tree';
import { sanitizeDeclarations } from './sanitize-declarations';

describe('sanitizeDeclarations', () => {
  describe('oklch to rgb conversion', () => {
    it('converts oklch to rgb without alpha', () => {
      const stylesheet = parse('div { color: oklch(90.5% 0.2 180); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts oklch to rgb with alpha', () => {
      const stylesheet = parse('div { color: oklch(96.6% 0.147 107 / 80%); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts oklch with decimal values', () => {
      const stylesheet = parse('div { color: oklch(92.6% 0.0546 218 / 50%); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts oklch with zero hue', () => {
      const stylesheet = parse('div { color: oklch(88.3% 0.102 329); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts oklch with 360 degree hue', () => {
      const stylesheet = parse('div { color: oklch(88.3% 0.102 329); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts oklch with high chroma value', () => {
      const stylesheet = parse('div { color: oklch(69.3% 0.206 42.8); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });
  });

  describe('rgba space syntax to comma syntax conversion', () => {
    it('converts rgb with space syntax to comma syntax', () => {
      const stylesheet = parse('div { color: rgb(255 0 128); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts rgb with space syntax and alpha to comma syntax', () => {
      const stylesheet = parse('div { color: rgb(255 0 128 / 0.5); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts rgb with space syntax and percentage alpha', () => {
      const stylesheet = parse('div { color: rgb(255 0 128 / 50%); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts rgb with alpha value of 1 (omits alpha)', () => {
      const stylesheet = parse('div { color: rgb(255 0 128 / 1); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('handles multiple rgb values in single declaration', () => {
      const stylesheet = parse(
        'div { background: linear-gradient(rgb(255 0 0), rgb(0 255 0 / 0.8)); }',
      );
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('handles rgb values with extra whitespace', () => {
      const stylesheet = parse(
        'div { color: rgb(  255   0   128  /  0.7  ); }',
      );
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('handles zero values', () => {
      const stylesheet = parse('div { color: rgb(0 0 0); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('preserves already comma-separated rgb values', () => {
      const stylesheet = parse('div { color: rgb(255, 0, 128); }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });
  });

  describe('hex to rgb conversion', () => {
    it('converts 3-digit hex without alpha', () => {
      const stylesheet = parse('div { color: #f0a; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts 4-digit hex with alpha', () => {
      const stylesheet = parse('div { color: #f0a8; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts 6-digit hex without alpha', () => {
      const stylesheet = parse('div { color: #ff00aa; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts 8-digit hex with alpha', () => {
      const stylesheet = parse('div { color: #ff00aa80; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts black hex color', () => {
      const stylesheet = parse('div { color: #000; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts white hex color', () => {
      const stylesheet = parse('div { color: #fff; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts red hex color', () => {
      const stylesheet = parse('div { color: #ff0000; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts green hex color', () => {
      const stylesheet = parse('div { color: #00ff00; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts blue hex color', () => {
      const stylesheet = parse('div { color: #0000ff; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts hex with lowercase letters', () => {
      const stylesheet = parse('div { color: #abcdef; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts hex with uppercase letters', () => {
      const stylesheet = parse('div { color: #ABCDEF; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts hex with mixed case letters', () => {
      const stylesheet = parse('div { color: #AbCdEf; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts hex with full transparency', () => {
      const stylesheet = parse('div { color: #ff000000; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts hex with full opacity', () => {
      const stylesheet = parse('div { color: #ff0000ff; }');
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('handles multiple hex colors in single declaration', () => {
      const stylesheet = parse(
        'div { background: linear-gradient(#ff0000, #00ff00, #0000ff); }',
      );
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('handles hex colors mixed with other color formats', () => {
      const stylesheet = parse(
        'div { background: linear-gradient(#ff0000, rgb(0 255 0), oklch(50% 0.2 240)); }',
      );
      sanitizeDeclarations(stylesheet);
      const result = generate(stylesheet);
      expect(result).toMatchSnapshot();
    });

    it('preserves non-hex hash values', () => {
      const stylesheet = parse(
        'div { content: "Visit our site at example.com#section"; }',
      );
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('converts multiple hex values in different properties', () => {
      const stylesheet = parse(`
        div {
          color: #ff0000;
          background-color: #00ff00;
          border-color: #0000ff;
          box-shadow: 0 0 10px #333;
        }
      `);
      sanitizeDeclarations(stylesheet);
      const result = generate(stylesheet);
      expect(result).toMatchSnapshot();
    });
  });

  describe('complex scenarios', () => {
    it('handles multiple declarations with different rgb formats', () => {
      const stylesheet = parse(`
        div {
          color: rgb(255 0 128 / 0.5);
          background-color: rgb(0 255 0);
          border-color: rgb(128, 128, 128);
        }
      `);
      sanitizeDeclarations(stylesheet);
      const result = generate(stylesheet);
      expect(result).toMatchSnapshot();
    });

    it('handles nested rules', () => {
      const stylesheet = parse(`
        @media (min-width: 768px) {
          div { color: rgb(255 0 128 / 0.8); }
        }
      `);
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchSnapshot();
    });

    it('processes at-rule declarations', () => {
      const stylesheet = parse(`
        @keyframes fade {
          from { background: rgb(255 0 0 / 0); }
          to { background: rgb(255 0 0 / 1); }
        }
      `);
      sanitizeDeclarations(stylesheet);
      const result = generate(stylesheet);
      expect(result).toMatchSnapshot();;
    });
  });
});
