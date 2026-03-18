import { downlevelForEmailClients } from './downlevel-for-email-clients';

describe('downlevelForEmailClients', () => {
  describe('range syntax', () => {
    it('converts width>= to min-width', () => {
      expect(
        downlevelForEmailClients(
          '@media (width>=40rem){.sm_p-4{padding:1rem}}',
        ),
      ).toBe('@media (min-width:40rem){.sm_p-4{padding:1rem}}');
    });

    it('converts width<= to max-width', () => {
      expect(
        downlevelForEmailClients(
          '@media (width<=40rem){.max-sm_p-4{padding:1rem}}',
        ),
      ).toBe('@media (max-width:40rem){.max-sm_p-4{padding:1rem}}');
    });

    it('converts width< to max-width', () => {
      expect(
        downlevelForEmailClients(
          '.max-sm_text-red-600{@media (width<40rem){color:red!important}}',
        ),
      ).toBe(
        '@media (max-width:40rem){.max-sm_text-red-600{color:red!important}}',
      );
    });

    it('converts width> to min-width', () => {
      expect(
        downlevelForEmailClients(
          '@media (width>40rem){.sm_p-4{padding:1rem}}',
        ),
      ).toBe('@media (min-width:40rem){.sm_p-4{padding:1rem}}');
    });

    it('converts height range syntax', () => {
      expect(
        downlevelForEmailClients('@media (height>=600px){.tall{color:red}}'),
      ).toBe('@media (min-height:600px){.tall{color:red}}');
    });

    it('does not match partial property names', () => {
      // prefers-color-scheme should not be affected
      expect(
        downlevelForEmailClients(
          '@media (prefers-color-scheme:dark){.dark{color:white}}',
        ),
      ).toBe('@media (prefers-color-scheme:dark){.dark{color:white}}');
    });
  });

  describe('unnesting', () => {
    it('unnests @media from inside a selector', () => {
      expect(
        downlevelForEmailClients(
          '.sm_bg-red-300{@media (min-width:40rem){background-color:red!important}}',
        ),
      ).toBe(
        '@media (min-width:40rem){.sm_bg-red-300{background-color:red!important}}',
      );
    });

    it('handles combined range syntax + nesting', () => {
      expect(
        downlevelForEmailClients(
          '.sm_bg-red-300{@media (width>=40rem){background-color:rgb(255,162,162)!important}}',
        ),
      ).toBe(
        '@media (min-width:40rem){.sm_bg-red-300{background-color:rgb(255,162,162)!important}}',
      );
    });

    it('handles multiple concatenated rules', () => {
      const input =
        '.sm_bg-red-300{@media (width>=40rem){background-color:red!important}}' +
        '.md_bg-red-400{@media (width>=48rem){background-color:blue!important}}' +
        '.lg_bg-red-500{@media (width>=64rem){background-color:green!important}}';

      const expected =
        '@media (min-width:40rem){.sm_bg-red-300{background-color:red!important}}' +
        '@media (min-width:48rem){.md_bg-red-400{background-color:blue!important}}' +
        '@media (min-width:64rem){.lg_bg-red-500{background-color:green!important}}';

      expect(downlevelForEmailClients(input)).toBe(expected);
    });

    it('preserves dark mode media queries and unnests them', () => {
      expect(
        downlevelForEmailClients(
          '.dark_text-white{@media (prefers-color-scheme:dark){color:rgb(255,255,255)!important}}',
        ),
      ).toBe(
        '@media (prefers-color-scheme:dark){.dark_text-white{color:rgb(255,255,255)!important}}',
      );
    });

    it('preserves rules without nested @media', () => {
      expect(
        downlevelForEmailClients('.bg-red-300{background-color:red}'),
      ).toBe('.bg-red-300{background-color:red}');
    });

    it('preserves already top-level @media rules', () => {
      expect(
        downlevelForEmailClients(
          '@media (min-width:40rem){.sm_p-4{padding:1rem!important}}',
        ),
      ).toBe('@media (min-width:40rem){.sm_p-4{padding:1rem!important}}');
    });

    it('passes through &:hover nesting unchanged', () => {
      // &:hover nesting is a separate problem — email clients don't support
      // :hover reliably anyway. This function only handles @media unnesting.
      const input =
        '.hover_bg-red-600{&:hover{@media (hover:hover){background-color:red!important}}}';
      expect(downlevelForEmailClients(input)).toBe(input);
    });

    it('handles multiple @media nested in one selector', () => {
      const input =
        '.multi{@media (width>=40rem){color:red!important}@media (width>=48rem){color:blue!important}}';

      const expected =
        '@media (min-width:40rem){.multi{color:red!important}}' +
        '@media (min-width:48rem){.multi{color:blue!important}}';

      expect(downlevelForEmailClients(input)).toBe(expected);
    });

    it('handles empty input', () => {
      expect(downlevelForEmailClients('')).toBe('');
    });
  });
});
