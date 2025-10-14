import { type CssNode, type Declaration, generate, walk } from 'css-tree';
import { getReactProperty } from '../compatibility/get-react-property';
import type { CustomProperties } from './get-custom-properties';
import { unwrapValue } from './unwrap-value';

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
        styles[getReactProperty(declaration.property)] =
          generate(declaration.value) +
          (declaration.important ? '!important' : '');
      },
    });
  }

  return styles;
}
