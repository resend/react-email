import {
  generate,
  parse,
  type StyleSheet,
  string,
  type Value,
  walk,
} from 'css-tree';
import { resolveAllCssVariables } from './utils/css/resolve-all-css-variables.js';
import { resolveCalcExpressions } from './utils/css/resolve-calc-expressions.js';
import { sanitizeDeclarations } from './utils/css/sanitize-declarations.js';

/**
 * Tailwind v4 defines variables like
 *   --tw-shadow: 0 4px 6px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1))
 * where --tw-shadow-color is only defined when a shadow color class is used.
 * Without this step, the var() inside the definition is copied into the
 * inline styles as is. Email clients do not support var(), so the whole
 * declaration is dropped. Here we use the fallback for any var() inside a
 * custom property definition that nothing in the stylesheet defines.
 */
function resolveFallbacksInDefinitions(
  styleSheet: StyleSheet,
  classesUsed: Set<string>,
) {
  const definedVariables = new Set<string>();
  // Like resolveAllCssVariables, ignore the @layer properties block, which only
  // resets variables to their initial values.
  const resetDeclarations = new Set<unknown>();
  walk(styleSheet, {
    visit: 'Atrule',
    enter(atrule) {
      if (
        atrule.name === 'layer' &&
        atrule.prelude !== null &&
        generate(atrule.prelude).includes('properties')
      ) {
        walk(atrule, {
          visit: 'Declaration',
          enter(declaration) {
            resetDeclarations.add(declaration);
          },
        });
      }
    },
  });
  // The compiler is cached and accumulates rules across renders, so a variable
  // defined only by a rule for a class this render does not use is not defined.
  const unusedDeclarations = new Set<unknown>();
  walk(styleSheet, {
    visit: 'Rule',
    enter(rule) {
      const selectorClasses: string[] = [];
      walk(rule.prelude, {
        visit: 'ClassSelector',
        enter(classSelector) {
          selectorClasses.push(string.decode(classSelector.name));
        },
      });
      if (
        selectorClasses.length > 0 &&
        !selectorClasses.some((name) => classesUsed.has(name))
      ) {
        walk(rule.block, {
          visit: 'Declaration',
          enter(declaration) {
            unusedDeclarations.add(declaration);
          },
        });
      }
    },
  });
  walk(styleSheet, {
    visit: 'Declaration',
    enter(declaration) {
      if (
        declaration.property.startsWith('--') &&
        !unusedDeclarations.has(declaration) &&
        !resetDeclarations.has(declaration)
      ) {
        definedVariables.add(declaration.property);
      }
    },
  });
  walk(styleSheet, {
    visit: 'Atrule',
    enter(atrule) {
      if (atrule.name !== 'property' || !atrule.prelude) {
        return;
      }
      walk(atrule, {
        visit: 'Declaration',
        enter(declaration) {
          if (declaration.property === 'initial-value') {
            definedVariables.add(generate(atrule.prelude!).trim());
          }
        },
      });
    },
  });

  walk(styleSheet, {
    visit: 'Declaration',
    enter(declaration) {
      if (
        !declaration.property.startsWith('--') ||
        resetDeclarations.has(declaration)
      ) {
        return;
      }
      // Custom property values are parsed as Raw, so parse them into a tree.
      const value = parse(generate(declaration.value), {
        context: 'value',
      }) as Value;
      let changed = false;
      walk(value, {
        visit: 'Function',
        enter(func, funcItem) {
          if (func.name !== 'var') {
            return;
          }
          const children = func.children.toArray();
          const name = children[0] ? generate(children[0]).trim() : '';
          const commaIndex = children.findIndex(
            (child) => child.type === 'Operator' && child.value === ',',
          );
          if (
            !name.startsWith('--') ||
            definedVariables.has(name) ||
            commaIndex === -1
          ) {
            return;
          }
          const fallback = children
            .slice(commaIndex + 1)
            .map((child) => generate(child))
            .join('')
            .trim();
          if (fallback.length === 0) {
            return;
          }
          const parsed = parse(fallback, { context: 'value' }) as Value;
          funcItem.data =
            parsed.children.size === 1 && parsed.children.first
              ? parsed.children.first
              : parsed;
          changed = true;
        },
      });
      if (changed) {
        declaration.value = value;
      }
    },
  });
}

export function sanitizeStyleSheet(
  styleSheet: StyleSheet,
  classesUsed: string[] = [],
) {
  resolveFallbacksInDefinitions(styleSheet, new Set(classesUsed));
  resolveAllCssVariables(styleSheet);
  resolveCalcExpressions(styleSheet);
  sanitizeDeclarations(styleSheet);
}
