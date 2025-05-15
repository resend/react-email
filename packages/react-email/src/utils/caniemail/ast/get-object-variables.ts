import type { Property, VariableDeclarator } from 'acorn';
import * as walk from 'acorn-walk';
import type { AST } from '../../parser';

export interface Position {
  line: number;
  column: number;
  index: number;
}

export type ObjectVariables = Record<string, Property[]>;

export const getObjectVariables = (ast: AST) => {
  const objectVariables: ObjectVariables = {};
  walk.ancestor(ast, {
    ObjectExpression(node, _, ancestors) {
      if (ancestors[0]?.type === 'VariableDeclarator') {
        const parent = ancestors[0] as VariableDeclarator;
        if (parent.id.type === 'Identifier') {
          const variableName = parent.id.name;
          const properties: Property[] = [];
          for (const property of node.properties) {
            if (property.type === 'Property') {
              properties.push(property);
            }
          }
          objectVariables[variableName] = properties;
        }
      }
    },
  });

  return objectVariables;
};
