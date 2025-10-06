import { type CssNode, generate, walk } from 'css-tree';
import { getReactProperty } from '../compatibility/get-react-property';
import type { VariableDefinition } from './resolve-all-css-variables';

export function makeInlineStylesFor(inlinableRules: CssNode[]) {
  const styles: Record<string, string> = {};

  for (const rule of inlinableRules) {
    const localVariableDefinitions = new Set<VariableDefinition>();
    walk(rule, {
      visit: 'Declaration',
      enter(declaration) {
        if (declaration.property.startsWith('--')) {
          localVariableDefinitions.add({
            declaration,
            definition: generate(declaration.value).trim(),
            variableName: declaration.property.trim(),
          });
        }
      },
    });

    walk(rule, {
      visit: 'Declaration',
      enter(declaration) {
        if (declaration.property.startsWith('--')) {
          return;
        }
        let value =
          generate(declaration.value) +
          (declaration.important ? '!important' : '');
        for (const localVarDef of localVariableDefinitions) {
          const varUsage = `var(${localVarDef.variableName})`;
          if (value.includes(varUsage)) {
            value = value.replaceAll(varUsage, localVarDef.definition);
          }
        }
        styles[getReactProperty(declaration.property)] = value;
      },
    });
  }

  return styles;
}
