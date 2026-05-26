import { type CssNode, generate, walk } from 'css-tree';

/**
 * Tailwind v4 emits variant-stacking idioms like
 *   font-variant-numeric: var(--tw-ordinal,) var(--tw-slashed-zero,) tabular-nums var(--tw-numeric-fraction,)
 *   filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-invert,) ...
 * where each var() has an empty fallback so missing variants collapse to nothing.
 * Tailwind deliberately leaves these variant vars undefined until used, so they
 * stay in the output here and produce unresolvable custom properties in email HTML
 * (no email client supports CSS custom properties reliably). Per the CSS spec
 * (https://www.w3.org/TR/css-variables-1/#using-variables) an empty fallback means
 * "use empty string if the variable is undefined", which is exactly what we want.
 *
 * Scoped to the `--tw-` prefix so any user-authored empty-fallback var() refs
 * are left untouched.
 *
 * Uses post-order traversal so an outer var(--tw-X, var(--tw-Y,)) collapses
 * correctly after the inner var() has been removed.
 */
export function stripEmptyTailwindVars(node: CssNode) {
  walk(node, {
    visit: 'Function',
    leave(func, funcItem, funcList) {
      if (func.name !== 'var') {
        return;
      }

      let variableName: string | undefined;
      walk(func, {
        visit: 'Identifier',
        enter(identifier) {
          variableName = identifier.name;
          return this.break;
        },
      });
      if (!variableName?.startsWith('--tw-')) {
        return;
      }

      let sawComma = false;
      let hasFallbackContent = false;
      func.children.forEach((child) => {
        if (!sawComma) {
          if (child.type === 'Operator' && child.value === ',') {
            sawComma = true;
          }
          return;
        }

        let childValue = generate(child).trim();
        if (child.type === 'Raw') {
          const emptyTailwindVarPattern = /var\(--tw-[^,()]+,\s*\)/g;
          childValue = childValue
            .replaceAll(emptyTailwindVarPattern, '')
            .trim();
        }

        if (childValue.length > 0) {
          hasFallbackContent = true;
        }
      });

      if (!sawComma || hasFallbackContent) {
        return;
      }

      funcList.remove(funcItem);
    },
  });
}
