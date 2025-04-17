import traverse from '@babel/traverse';
import type { Node } from '@babel/traverse';
import type { AST } from '../../../actions/email-validation/check-compatibility';

export interface Position {
  line: number;
  column: number;
  index: number;
}

export const convertLocationIntoObject = (
  location: SourceLocation,
): SourceLocation => {
  return {
    start: {
      line: location.start.line,
      column: location.start.column,
      index: location.start.index,
    },
    end: {
      line: location.end.line,
      column: location.end.column,
      index: location.end.index,
    },
    filename: location.filename,
    identifierName: location.identifierName,
  };
};

export interface SourceLocation {
  start: Position;
  end: Position;
  filename: string;
  identifierName: string | undefined | null;
}

type ObjectProperty = Node & { type: 'ObjectProperty' };

export type ObjectVariables = Record<string, ObjectProperty[]>;

export const getObjectVariables = (ast: AST) => {
  const objectVariables: ObjectVariables = {};
  traverse(ast, {
    ObjectExpression(nodePath) {
      if (nodePath.parent.type === 'VariableDeclarator') {
        if (nodePath.parent.id.type === 'Identifier') {
          const variableName = nodePath.parent.id.name;
          const properties: ObjectProperty[] = [];
          for (const property of nodePath.node.properties) {
            if (property.type === 'ObjectProperty') {
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
