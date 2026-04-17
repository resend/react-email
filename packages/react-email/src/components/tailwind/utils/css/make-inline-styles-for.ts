import { type CssNode, type Declaration, generate, walk } from 'css-tree';
import { getReactProperty } from '../compatibility/get-react-property.js';
import type { CustomProperties } from './get-custom-properties.js';
import { unwrapValue } from './unwrap-value.js';

export function makeInlineStylesFor(
  inlinableRules: CssNode[],
  customProperties: CustomProperties,
) {
  const styles: Record<string, string> = {};

  const localVariableDeclarations = new Map<string, Declaration>();
  for (const rule of inlinableRules) {
    walk(rule, {
      visit: 'Declaration',
      enter(declaration) {
        if (declaration.property.startsWith('--')) {
          localVariableDeclarations.set(declaration.property, declaration);
        }
      },
    });
  }

  for (const rule of inlinableRules) {
    walk(rule, {
      visit: 'Function',
      enter(func, funcParentListItem) {
        if (func.name === 'var') {
          let variableName: string | undefined;
          walk(func, {
            visit: 'Identifier',
            enter(identifier) {
              variableName = identifier.name;
              return this.break;
            },
          });
          if (variableName) {
            const definition = localVariableDeclarations.get(variableName);
            if (definition) {
              funcParentListItem.data = unwrapValue(definition.value);
            } else {
              // For most variables tailwindcss defines, they also define a custom
              // property for them with an initial value that we can inline here
              const customProperty = customProperties.get(variableName);
              if (customProperty?.initialValue) {
                funcParentListItem.data = unwrapValue(
                  customProperty.initialValue.value,
                );
              }
            }
          }
        }
      },
    });

    walk(rule, {
      visit: 'Declaration',
      enter(declaration) {
        if (declaration.property.startsWith('--')) {
          return;
        }
        // Tailwind v4 emits variant-stacking idioms like
        //   font-variant-numeric: var(--tw-ordinal,) var(--tw-slashed-zero,) tabular-nums var(--tw-numeric-fraction,)
        // where each var() has an empty fallback so missing variants collapse to nothing.
        // The walker above replaces var() calls with an initialValue when one is defined,
        // but Tailwind deliberately leaves these variant vars undefined until used, so they
        // stay in the output here and produce unresolvable custom properties in email HTML
        // (no email client supports CSS custom properties reliably). Per the CSS spec
        // (https://www.w3.org/TR/css-variables-1/#using-variables) an empty fallback means
        // "use empty string if the variable is undefined", which is exactly what we want at
        // inline-style time.
        const rawValue = generate(declaration.value);
        const cleanedValue = rawValue
          .replace(/var\(\s*--[\w-]+\s*,\s*\)/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        styles[getReactProperty(declaration.property)] =
          cleanedValue + (declaration.important ? '!important' : '');
      },
    });
  }

  return styles;
}
