import type { Rule } from 'css-tree';
import type { OrderedRule } from './extract-rules-per-class.js';

export const sortRulesByOrder = (
  orderedRules: readonly OrderedRule[],
): Rule[] =>
  orderedRules
    .toSorted((a, b) => a.order - b.order)
    .map((orderedRule) => orderedRule.rule);
