import { compile, serialize, stringify } from 'stylis';
import { isRuleInlinable } from './is-rule-inlinable';

describe('isRuleInlinable()', () => {
  it('should be false when there is any at rule', () => {
    const result = compile(`
      .foo {
        @media (min-width: 640px) {
          color: blue;
        }
      }
    `);
    console.log(serialize(result, stringify));
    expect(isRuleInlinable(result[0])).toBe(false);
  });
});
