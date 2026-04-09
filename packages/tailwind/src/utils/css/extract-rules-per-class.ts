import { type CssNode, type Rule, string, walk } from 'css-tree';
import { isRuleInlinable } from './is-rule-inlinable';
import { splitMixedRule } from './split-mixed-rule';

export function extractRulesPerClass(root: CssNode, classes: string[]) {
  const classSet = new Set(classes);

  const inlinableRules = new Map<string, Rule>();
  const nonInlinableRules = new Map<string, Rule>();
  walk(root, {
    visit: 'Rule',
    enter(rule) {
      const selectorClasses: string[] = [];
      if (rule.prelude) {
        walk(rule.prelude, {
          visit: 'ClassSelector',
          enter(classSelector) {
            selectorClasses.push(string.decode(classSelector.name));
          },
        });
      }

      const matchingClasses = selectorClasses.filter((c) => classSet.has(c));
      if (matchingClasses.length === 0) return;

      if (isRuleInlinable(rule)) {
        for (const className of matchingClasses) {
          inlinableRules.set(className, rule);
        }
      } else {
        const { inlinablePart, nonInlinablePart } = splitMixedRule(rule);
        for (const className of matchingClasses) {
          if (inlinablePart) {
            inlinableRules.set(className, inlinablePart);
          }
          if (nonInlinablePart) {
            nonInlinableRules.set(className, nonInlinablePart);
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
