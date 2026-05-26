import { type CssNode, string, walk } from 'css-tree';
import { sanitizeClassName } from '../compatibility/sanitize-class-name.js';
import { isRuleInlinable } from './is-rule-inlinable.js';
import { stripEmptyTailwindVars } from './strip-empty-tailwind-vars.js';

/**
 * This function goes through a few steps to ensure the best email client support and
 * to ensure that media queries and pseudo classes are applied correctly alongside
 * the inline styles.
 *
 * What it does:
 * 1. Converts all declarations in all rules into important ones
 * 2. Sanitizes class selectors of all non-inlinable rules
 * 3. Strips empty-fallback var(--tw-*,) refs that Tailwind v4 emits for
 *    variant-stacking idioms (filter, font-variant-numeric, etc.) — email
 *    clients can't resolve CSS custom properties reliably, so any --tw-*
 *    left as a bare empty-fallback ref would reach the client broken.
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
            if (!declaration.property.startsWith('--')) {
              stripEmptyTailwindVars(declaration.value);
            }
          },
        });
      }
    },
  });
}
