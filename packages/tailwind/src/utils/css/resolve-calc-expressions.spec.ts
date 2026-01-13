import { generate, parse } from 'css-tree';
import { resolveCalcExpressions } from './resolve-calc-expressions';

describe('resolveCalcExpressions()', () => {
  it('resolves spacing calc expressions from tailwind v4', () => {
    const root = parse(`
.px-3{padding-inline:calc(0.25rem*3)}
.py-2{padding-block:calc(0.25rem*2)}
  `);
    resolveCalcExpressions(root);
    expect(generate(root)).toMatchInlineSnapshot(`".px-3{padding-inline:0.75rem}.py-2{padding-block:0.5rem}"`);
  });

  it('resolves calc expressions repeating decimals', () => {
    const root = parse(`
      .w-1/3 { width: calc(0.3333333333333333*100%); }
    `);
    resolveCalcExpressions(root);
    expect(generate(root)).toMatchInlineSnapshot(`".w-1/3{width:33.33333333333333%}"`);
  });

  it('does not modify complex calc expressions', () => {
    const root = parse(`
.px-3{padding-inline:calc(0.25rem*(3 + 1px))}
.py-2{padding-block:calc(0.25rem*(2 + 1px))}
  `);
    resolveCalcExpressions(root);
    expect(generate(root)).toMatchInlineSnapshot(`".px-3{padding-inline:calc(0.25rem*(3 + 1px))}.py-2{padding-block:calc(0.25rem*(2 + 1px))}"`);
  });
});
