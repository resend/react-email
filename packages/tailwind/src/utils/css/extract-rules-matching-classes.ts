import { type CssNode, generate, string, walk } from 'css-tree';
import { sanitizeClassName } from '../compatibility/sanitize-class-name';
import { isRuleInlinable } from './is-rule-inlinable';

export const extractRulesMatchingStyles = (
  classes: string[],
  root: CssNode,
) => {
  const rules = new Map<
    string,
    {
      rule: CssNode;
      inlinable: boolean;
    }
  >();
  walk(root, {
    visit: 'Rule',
    enter(rule) {
      const selector = generate(rule.prelude);
      if (isRuleInlinable(rule)) {
        const matchingClass = classes.find((cls) =>
          string.decode(selector).includes(`.${cls}`),
        );
        if (matchingClass) {
          rules.set(matchingClass, {
            rule,
            inlinable: true,
          });
        }
      } else {
        const matchingClass = classes.find((cls) =>
          string.decode(selector).includes(`.${sanitizeClassName(cls)}`),
        );
        if (matchingClass) {
          rules.set(matchingClass, {
            rule,
            inlinable: false,
          });
        }
      }
    },
  });
  return rules;
};
