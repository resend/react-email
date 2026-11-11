import { spaceAdjacentClosingBraces } from './space-adjacent-closing-braces.js';

describe('spaceAdjacentClosingBraces', () => {
  it('separates adjacent closing braces between at-rule blocks', () => {
    expect(
      spaceAdjacentClosingBraces(
        '@media (min-width:40rem){.sm_a{color:red}}@media (prefers-color-scheme:dark){.dark_b{color:blue}}',
      ),
    ).toBe(
      '@media (min-width:40rem){.sm_a{color:red} }@media (prefers-color-scheme:dark){.dark_b{color:blue} }',
    );
  });

  it('leaves css without adjacent closing braces unchanged', () => {
    expect(spaceAdjacentClosingBraces('.a{color:red}')).toBe('.a{color:red}');
  });
});
