import {
  type CssNode,
  clone,
  type Declaration,
  type Raw,
  type Value,
  walk,
} from 'css-tree';
import type { CustomProperties } from './get-custom-properties.js';
import { unwrapValue } from './unwrap-value.js';

export const resolveVariableFunctions = (
  node: CssNode,
  localVariableDeclarations: Map<string, Declaration>,
  customProperties: CustomProperties,
  seen: ReadonlySet<string> = new Set(),
): void => {
  walk(node, {
    visit: 'Function',
    enter(func, funcParentListItem) {
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

      if (!variableName || seen.has(variableName)) {
        return;
      }

      const localDefinition = localVariableDeclarations.get(variableName);
      const replacementValue = localDefinition
        ? localDefinition.value
        : customProperties.get(variableName)?.initialValue?.value;

      if (!replacementValue) {
        return;
      }

      const clonedValue = clone(replacementValue) as Value | Raw;
      resolveVariableFunctions(
        clonedValue,
        localVariableDeclarations,
        customProperties,
        new Set([...seen, variableName]),
      );

      funcParentListItem.data = unwrapValue(clonedValue);
    },
  });
};
