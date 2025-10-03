import { generate, parse } from 'css-tree';
import { resolveCalcExpressions } from './resolve-calc-expressions';

describe('resolveCalcExpressions()', async () => {
  it('should resolve spacing calc expressions from tailwind v4', () => {
    const root = parse(`
.px-3{padding-inline:calc(0.25rem*3)}
.py-2{padding-block:calc(0.25rem*2)}
  `);
    resolveCalcExpressions(root);
    expect(generate(root)).toMatchSnapshot();
  });

  it('resolves calc expressions repeating decimals', () => {
    const root = parse(`
      .w-1\/3 { width: calc(0.3333333333333333*100%); }
    `);
    resolveCalcExpressions(root);
    expect(generate(root)).toBe('');
  });

  it('should not do anything to complex calc expressions', () => {
    const root = parse(`
.px-3{padding-inline:calc(0.25rem*(3 + 1px))}
.py-2{padding-block:calc(0.25rem*(2 + 1px))}
  `);
    resolveCalcExpressions(root);
    expect(generate(root)).toMatchSnapshot();
  });
});
