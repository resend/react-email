import { type CssNode, string, walk } from 'css-tree';
import { sanitizeClassName } from '../compatibility/sanitize-class-name';
import { isRuleInlinable } from './is-rule-inlinable';

/**
 * This function goes through a few steps to ensure the best email client support and
 * to ensure that the media queries and pseudo classes are going to applied correctly alongside
 * the inline styles.
 *
 * What it does is:
 * 1. Converts all declarations in all rules into being important ones
 * 2. Sanitizes all the selectors of all non-inlinable rules
 */
export function sanitizeNonInlinableRules(node: CssNode) {
  walk(node, {
    visit: 'Rule',
    enter(rule) {
      if (!isRuleInlinable(rule)) {
        walk(rule.prelude, (node) => {
          if (node.type === 'ClassSelector') {
            const unescapedClassName = string.decode(node.name);
            node.name = sanitizeClassName(unescapedClassName);
          }
        });

        walk(rule, {
          visit: 'Declaration',
          enter(declaration) {
            declaration.important = true;
          },
        });
      }
    },
  });
};
