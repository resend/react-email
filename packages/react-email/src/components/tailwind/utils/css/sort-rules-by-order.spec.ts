import { generate, parse, type Rule, type StyleSheet } from 'css-tree';
import type { OrderedRule } from './extract-rules-per-class.js';
import { sortRulesByOrder } from './sort-rules-by-order.js';

const parseRule = (css: string): Rule =>
  (parse(css) as StyleSheet).children.first as Rule;

describe('sortRulesByOrder()', () => {
  it('returns rules ordered by their global source-order index', () => {
    const first = parseRule('.a { color: red; }');
    const second = parseRule('.b { color: green; }');
    const third = parseRule('.c { color: blue; }');

    const orderedRules: OrderedRule[] = [
      { rule: third, order: 2 },
      { rule: first, order: 0 },
      { rule: second, order: 1 },
    ];

    expect(
      sortRulesByOrder(orderedRules).map((rule) => generate(rule)),
    ).toEqual(['.a{color:red}', '.b{color:green}', '.c{color:blue}']);
  });

  it('keeps insertion order for rules sharing the same index', () => {
    const first = parseRule('.a { color: red; }');
    const second = parseRule('.b { color: green; }');

    const orderedRules: OrderedRule[] = [
      { rule: first, order: 0 },
      { rule: second, order: 0 },
    ];

    expect(
      sortRulesByOrder(orderedRules).map((rule) => generate(rule)),
    ).toEqual(['.a{color:red}', '.b{color:green}']);
  });
});
