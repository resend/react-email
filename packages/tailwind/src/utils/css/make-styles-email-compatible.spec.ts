import { generate, parse, type StyleSheet } from 'css-tree';
import { describe, expect, it } from 'vitest';
import { makeStylesEmailCompatible } from './make-styles-email-compatible';

function transform(css: string): string {
  const styleSheet = parse(css) as StyleSheet;
  makeStylesEmailCompatible(styleSheet);
  return generate(styleSheet);
}

describe('makeStylesEmailCompatible', () => {
  describe('unnests media queries', () => {
    it('moves @media from inside a rule to outside', () => {
      const input =
        '.sm_bg-red-300{@media (width>=40rem){background-color:red!important}}';
      const output = transform(input);
      expect(output).toBe(
        '@media (min-width:640px){.sm_bg-red-300{background-color:red!important}}',
      );
    });

    it('handles multiple rules with the same breakpoint', () => {
      const input =
        '.sm_bg-red{@media (width>=40rem){background-color:red!important}}' +
        '.sm_text-sm{@media (width>=40rem){font-size:14px!important}}';
      const output = transform(input);
      expect(output).toBe(
        '@media (min-width:640px){.sm_bg-red{background-color:red!important}.sm_text-sm{font-size:14px!important}}',
      );
    });

    it('handles multiple different breakpoints', () => {
      const input =
        '.sm_p-2{@media (width>=40rem){padding:8px!important}}' +
        '.md_p-4{@media (width>=48rem){padding:16px!important}}' +
        '.lg_p-8{@media (width>=64rem){padding:32px!important}}';
      const output = transform(input);
      expect(output).toBe(
        '@media (min-width:640px){.sm_p-2{padding:8px!important}}' +
          '@media (min-width:768px){.md_p-4{padding:16px!important}}' +
          '@media (min-width:1024px){.lg_p-8{padding:32px!important}}',
      );
    });
  });

  describe('converts range syntax to legacy min-width/max-width', () => {
    it('converts width >= Xrem to min-width: Xpx', () => {
      const input = '.sm_p-2{@media (width>=40rem){padding:8px!important}}';
      const output = transform(input);
      expect(output).toContain('@media (min-width:640px)');
    });

    it('converts width < Xrem to max-width: (X-0.02)px', () => {
      const input = '.max-sm_text{@media (width<40rem){color:red!important}}';
      const output = transform(input);
      expect(output).toContain('@media (max-width:639.98px)');
    });

    it('handles px units in breakpoints (no rem conversion needed)', () => {
      const input = '.xl_bg{@media (width>=1280px){background:blue!important}}';
      const output = transform(input);
      expect(output).toContain('@media (min-width:1280px)');
    });
  });

  describe('resolves CSS nesting selectors', () => {
    it('resolves &:hover nesting', () => {
      const input = '.focus_bg-red{&:focus{background-color:red!important}}';
      const output = transform(input);
      expect(output).toBe(
        '.focus_bg-red:focus{background-color:red!important}',
      );
    });

    it('resolves &:hover with nested @media', () => {
      const input =
        '.hover_bg{&:hover{@media (hover:hover){background:red!important}}}';
      const output = transform(input);
      expect(output).toBe(
        '@media (hover:hover){.hover_bg:hover{background:red!important}}',
      );
    });

    it('resolves complex nesting with @media + &:hover + @media', () => {
      const input =
        '.sm_hover_bg{@media (width>=40rem){&:hover{@media (hover:hover){background:red!important}}}}';
      const output = transform(input);
      expect(output).toBe(
        '@media (min-width:640px){@media (hover:hover){.sm_hover_bg:hover{background:red!important}}}',
      );
    });
  });

  describe('preserves non-responsive media queries', () => {
    it('handles prefers-color-scheme', () => {
      const input =
        '.text-body{@media (prefers-color-scheme:dark){color:orange!important}}';
      const output = transform(input);
      expect(output).toBe(
        '@media (prefers-color-scheme:dark){.text-body{color:orange!important}}',
      );
    });
  });

  describe('converts rem to px in legacy Feature nodes', () => {
    it('converts rem in min-width Feature', () => {
      const input = '@media (min-width:40rem){.test{color:red}}';
      const output = transform(input);
      expect(output).toBe('@media (min-width:640px){.test{color:red}}');
    });

    it('converts rem in max-width Feature', () => {
      const input = '@media (max-width:48rem){.test{color:blue}}';
      const output = transform(input);
      expect(output).toBe('@media (max-width:768px){.test{color:blue}}');
    });
  });

  describe('handles edge cases', () => {
    it('handles rules with multiple declarations', () => {
      const input =
        '.sm_text-sm{@media (width>=40rem){font-size:14px!important;line-height:1.4!important}}';
      const output = transform(input);
      expect(output).toBe(
        '@media (min-width:640px){.sm_text-sm{font-size:14px!important;line-height:1.4!important}}',
      );
    });

    it('preserves rules without media queries', () => {
      const input = '.plain{color:red!important}';
      const output = transform(input);
      expect(output).toBe('.plain{color:red!important}');
    });

    it('preserves multiple non-media rules without dropping any', () => {
      const input =
        '.a:hover{color:red!important}.b:focus{color:blue!important}';
      const output = transform(input);
      expect(output).toContain('.a:hover{color:red!important}');
      expect(output).toContain('.b:focus{color:blue!important}');
    });

    it('handles & replacement with comma-separated parent selectors', () => {
      const input = '.a,.b{&:hover{color:red!important}}';
      const output = transform(input);
      expect(output).toBe('.a:hover,.b:hover{color:red!important}');
    });
  });
});
