import { type CssNode, type Rule, string, walk } from 'css-tree';
import { isRuleInlinable } from './is-rule-inlinable.js';
import { splitMixedRule } from './split-mixed-rule.js';

export function extractRulesPerClass(root: CssNode, classes: string[]) {
  const classSet = new Set(classes);

  // A class can be defined by multiple rules (e.g. a preset and a child config
  // override), so keep them all to merge instead of the last one clobbering.
  const inlinableRules = new Map<string, Rule[]>();
  const nonInlinableRules = new Map<string, Rule[]>();

  const appendRule = (
    map: Map<string, Rule[]>,
    className: string,
    rule: Rule,
  ) => {
    const existing = map.get(className);
    if (existing) {
      existing.push(rule);
    } else {
      map.set(className, [rule]);
    }
  };

  walk(root, {
    visit: 'Rule',
    enter(rule) {
      const selectorClasses: string[] = [];
      walk(rule, {
        visit: 'ClassSelector',
        enter(classSelector) {
          selectorClasses.push(string.decode(classSelector.name));
        },
      });
      if (isRuleInlinable(rule)) {
        for (const className of selectorClasses) {
          if (classSet.has(className)) {
            appendRule(inlinableRules, className, rule);
          }
        }
      } else {
        const { inlinablePart, nonInlinablePart } = splitMixedRule(rule);
        for (const className of selectorClasses) {
          if (!classSet.has(className)) continue;
          if (inlinablePart) {
            appendRule(inlinableRules, className, inlinablePart);
          }
          if (nonInlinablePart) {
            appendRule(nonInlinableRules, className, nonInlinablePart);
          }
        }
      }
    },
  });
  return {
    inlinable: inlinableRules,
    nonInlinable: nonInlinableRules,
  };
}
