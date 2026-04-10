import { generate, parse, type StyleSheet } from 'css-tree';
import { downlevelCss } from './downlevel-css';

function transform(css: string): string {
  const ast = parse(css) as StyleSheet;
  downlevelCss(ast);
  return generate(ast);
}

describe('downlevelCss()', () => {
  describe('range media feature conversion', () => {
    it('converts width>= to min-width', () => {
      expect(transform('@media (width>=40rem){.foo{padding:1rem}}')).toBe(
        '@media (min-width:40rem){.foo{padding:1rem}}',
      );
    });

    it('converts width<= to max-width', () => {
      expect(transform('@media (width<=40rem){.foo{padding:1rem}}')).toBe(
        '@media (max-width:40rem){.foo{padding:1rem}}',
      );
    });

    it('does not modify non-range media features', () => {
      expect(transform('@media (hover:hover){.foo{color:red}}')).toBe(
        '@media (hover:hover){.foo{color:red}}',
      );
    });
  });

  describe('CSS unnesting', () => {
    it('hoists @media out of rules', () => {
      expect(
        transform('.sm_p-4{@media (width>=40rem){padding:1rem!important}}'),
      ).toBe('@media (min-width:40rem){.sm_p-4{padding:1rem!important}}');
    });

    it('resolves & nesting selector with pseudo class', () => {
      expect(transform('.foo{&:hover{color:red}}')).toBe(
        '.foo:hover{color:red}',
      );
    });

    it('handles @media + & combined', () => {
      expect(
        transform(
          '.sm_focus_outline-none{@media (width>=40rem){&:focus{outline-style:none!important}}}',
        ),
      ).toBe(
        '@media (min-width:40rem){.sm_focus_outline-none:focus{outline-style:none!important}}',
      );
    });

    it('handles triple nesting: @media > &:hover > @media (hover:hover)', () => {
      expect(
        transform(
          '.sm_hover_bg-red{@media (width>=40rem){&:hover{@media (hover:hover){background-color:red!important}}}}',
        ),
      ).toBe(
        '@media (min-width:40rem){@media (hover:hover){.sm_hover_bg-red:hover{background-color:red!important}}}',
      );
    });

    it('leaves plain rules unchanged', () => {
      expect(transform('.foo{padding:1rem}')).toBe('.foo{padding:1rem}');
    });

    it('handles multiple rules', () => {
      expect(
        transform(
          '.a{@media (width>=40rem){padding:1rem!important}}.b{@media (width>=48rem){margin:2rem!important}}',
        ),
      ).toBe(
        '@media (min-width:40rem){.a{padding:1rem!important}}@media (min-width:48rem){.b{margin:2rem!important}}',
      );
    });
  });
});
