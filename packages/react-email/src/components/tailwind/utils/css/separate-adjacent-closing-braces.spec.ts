import { generate, parse } from 'css-tree';
import { separateAdjacentClosingBraces } from './separate-adjacent-closing-braces.js';

const generateFor = (css: string) =>
  generate(parse(css), { decorator: separateAdjacentClosingBraces });

describe('separateAdjacentClosingBraces()', () => {
  it('separates the closing braces between at-rule blocks', () => {
    expect(
      generateFor(
        '@media (min-width:40rem){.a{color:red}}@media (prefers-color-scheme:dark){.b{color:blue}}',
      ),
    ).toBe(
      '@media (min-width:40rem){.a{color:red} }@media (prefers-color-scheme:dark){.b{color:blue} }',
    );
  });

  it('separates every closing brace in deeply nested blocks', () => {
    expect(
      generateFor(
        '@media (min-width:40rem){.a{@media (hover:hover){&:hover{color:red}}}}',
      ),
    ).toBe(
      '@media (min-width:40rem){.a{@media (hover:hover){&:hover{color:red} } } }',
    );
  });

  it('does not touch closing braces inside strings', () => {
    expect(generateFor('.a{&::after{content:"}}"}}')).toBe(
      '.a{&::after{content:"}}"} }',
    );
  });

  it('does not touch closing braces inside url()', () => {
    expect(generateFor('.a{background:url("a}}b.png")}')).toBe(
      '.a{background:url(a}}b.png)}',
    );
  });

  it('leaves css without adjacent closing braces unchanged', () => {
    expect(generateFor('.a{color:red}.b{color:blue}')).toBe(
      '.a{color:red}.b{color:blue}',
    );
  });
});
