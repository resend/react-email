import { type CssNode, type Rule, string, walk } from 'css-tree';
import { isRuleInlinable } from './is-rule-inlinable';

export function extractRulesPerClass(root: CssNode, classes: string[]) {
  const classSet = new Set(classes);

  const inlinableRules = new Map<string, Rule>();
  const nonInlinableRules = new Map<string, Rule>();
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
            inlinableRules.set(className, rule);
          }
        }
      } else {
        for (const className of selectorClasses) {
          if (classSet.has(className)) {
            nonInlinableRules.set(className, rule);
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
