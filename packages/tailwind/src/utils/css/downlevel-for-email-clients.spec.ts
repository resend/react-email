import { generate, parse, type StyleSheet } from 'css-tree';
import { downlevelForEmailClients } from './downlevel-for-email-clients';

function transform(css: string): string {
  const ast = parse(css) as StyleSheet;
  downlevelForEmailClients(ast);
  return generate(ast);
}

describe('downlevelForEmailClients', () => {
  describe('range syntax', () => {
    it('converts width>= to min-width', () => {
      expect(
        transform('@media (width>=40rem){.sm_p-4{padding:1rem}}'),
      ).toBe('@media (min-width:40rem){.sm_p-4{padding:1rem}}');
    });

    it('converts width<= to max-width', () => {
      expect(
        transform('@media (width<=40rem){.max-sm_p-4{padding:1rem}}'),
      ).toBe('@media (max-width:40rem){.max-sm_p-4{padding:1rem}}');
    });

    it('converts width< to max-width', () => {
      expect(
        transform('@media (width<40rem){.max-sm_text-red{color:red}}'),
      ).toBe('@media (max-width:40rem){.max-sm_text-red{color:red}}');
    });

    it('converts width> to min-width', () => {
      expect(
        transform('@media (width>40rem){.sm_p-4{padding:1rem}}'),
      ).toBe('@media (min-width:40rem){.sm_p-4{padding:1rem}}');
    });

    it('does not affect non-range media queries', () => {
      expect(
        transform(
          '@media (prefers-color-scheme:dark){.dark{color:white}}',
        ),
      ).toBe('@media (prefers-color-scheme:dark){.dark{color:white}}');
    });
  });

  describe('unnesting', () => {
    it('unnests @media from inside a selector', () => {
      expect(
        transform(
          '.sm_bg-red{@media (min-width:40rem){background-color:red!important}}',
        ),
      ).toBe(
        '@media (min-width:40rem){.sm_bg-red{background-color:red!important}}',
      );
    });

    it('handles combined range syntax + nesting', () => {
      expect(
        transform(
          '.sm_bg-red{@media (width>=40rem){background-color:rgb(255,162,162)!important}}',
        ),
      ).toBe(
        '@media (min-width:40rem){.sm_bg-red{background-color:rgb(255,162,162)!important}}',
      );
    });

    it('handles multiple concatenated rules', () => {
      const input =
        '.sm_bg-red{@media (width>=40rem){background-color:red!important}}' +
        '.md_bg-blue{@media (width>=48rem){background-color:blue!important}}';

      const result = transform(input);

      expect(result).toContain(
        '@media (min-width:40rem){.sm_bg-red{background-color:red!important}}',
      );
      expect(result).toContain(
        '@media (min-width:48rem){.md_bg-blue{background-color:blue!important}}',
      );
    });

    it('unnests dark mode media queries', () => {
      expect(
        transform(
          '.dark_text-white{@media (prefers-color-scheme:dark){color:rgb(255,255,255)!important}}',
        ),
      ).toBe(
        '@media (prefers-color-scheme:dark){.dark_text-white{color:rgb(255,255,255)!important}}',
      );
    });

    it('preserves rules without nested @media', () => {
      expect(transform('.bg-red{background-color:red}')).toBe(
        '.bg-red{background-color:red}',
      );
    });

    it('preserves already top-level @media rules', () => {
      expect(
        transform(
          '@media (min-width:40rem){.sm_p-4{padding:1rem!important}}',
        ),
      ).toBe(
        '@media (min-width:40rem){.sm_p-4{padding:1rem!important}}',
      );
    });

    it('handles multiple @media nested in one selector', () => {
      const input =
        '.multi{@media (width>=40rem){color:red!important}@media (width>=48rem){color:blue!important}}';

      const result = transform(input);

      expect(result).toContain(
        '@media (min-width:40rem){.multi{color:red!important}}',
      );
      expect(result).toContain(
        '@media (min-width:48rem){.multi{color:blue!important}}',
      );
    });

    it('handles empty stylesheet', () => {
      expect(transform('')).toBe('');
    });
  });
});
