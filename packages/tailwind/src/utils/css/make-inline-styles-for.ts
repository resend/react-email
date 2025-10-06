import { type CssNode, type Declaration, generate, walk } from 'css-tree';
import { getReactProperty } from '../compatibility/get-react-property';

export function makeInlineStylesFor(inlinableRules: CssNode[]) {
  const styles: Record<string, string> = {};

  const localVariableDeclarations = new Set<Declaration>();
  for (const rule of inlinableRules) {
    walk(rule, {
      visit: 'Declaration',
      enter(declaration) {
        if (declaration.property.startsWith('--')) {
          localVariableDeclarations.add(declaration);
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
            const definition = Array.from(localVariableDeclarations).find(
              (declaration) => variableName === declaration.property,
            );
            if (definition) {
              funcParentListItem.data = definition.value;
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
