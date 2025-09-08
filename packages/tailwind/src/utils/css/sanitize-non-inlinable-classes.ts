import { type CssNode, type Rule, walk, string } from 'css-tree';
import { sanitizeClassName } from '../compatibility/sanitize-class-name';
import { clone } from './clone';
import { isRuleInlinable } from './is-rule-inlinable';

/**
 * This function goes through a few steps to ensure the best email client support and
 * to ensure that the media queries and pseudo classes are going to applied correctly alongside
 * the inline styles.
 *
 * What it does is:
 * 1. Converts all declarations in all rules into being important ones
 * 2. Sanitizes all the selectors of all non-inlinable rules
 * 3. Merges at rules that have equivalent parameters
 */
export const sanitizeNonInlinableClasses = (node: CssNode) => {
  const sanitizedRules: Rule[] = [];
  const nonInlinableClasses: string[] = [];

  let rootRule: Rule | undefined;

  walk(node, {
    visit: 'Rule',
    enter(rule) {
      if (!rootRule) {
        rootRule = rule;
      }
    },
    leave(rule) {
      if (rootRule === rule) {
        rootRule = undefined;
      }
      if (!isRuleInlinable(rule)) {
        const ruleToChange = !rootRule ? (clone(rule) as Rule) : rule;

        walk(ruleToChange.prelude, (node) => {
          if (node.type === 'ClassSelector') {
            const unescapedClassName = string.decode(node.name);
            console.log(node.name, unescapedClassName);
            nonInlinableClasses.push(unescapedClassName);
            node.name = sanitizeClassName(unescapedClassName);
          }
        });

        walk(ruleToChange, {
          visit: 'Declaration',
          enter(declaration) {
            declaration.important = true;
          },
        });

        if (!rootRule) {
          sanitizedRules.push(ruleToChange);
        }
      }
    },
  });

  return {
    nonInlinableClasses,
    sanitizedRules,
  };
};
