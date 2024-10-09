import traverse from '@babel/traverse';
import type { AST } from '../get-insights-for-email';
import type { ObjectVariables, SourceLocation } from './get-object-variables';

export interface StylePropertyUsage {
  location: SourceLocation | undefined | null;
  name: string;
  value: string;
}

export const doesPropertyHaveLocation = (
  prop: StylePropertyUsage,
): prop is StylePropertyUsage & { location: SourceLocation } => {
  return prop.location !== undefined && prop.location !== null;
};

export const getUsedStyleProperties = (ast: AST, objectVariables: ObjectVariables) => {
  const styleProperties: StylePropertyUsage[] = [];
  traverse(ast, {
    JSXAttribute(path) {
      if (
        path.node.value?.type === 'JSXExpressionContainer' &&
        path.node.value.expression.type === 'Identifier' &&
        path.node.name.name === 'style'
      ) {
        const styleVariable = objectVariables[path.node.value.expression.name];
        if (styleVariable) {
          for (const property of styleVariable) {
            if (
              (property.key.type === 'StringLiteral' ||
                property.key.type === 'Identifier') &&
              property.value.type === 'StringLiteral'
            ) {
              const propertyName =
                property.key.type === 'StringLiteral'
                  ? property.key.value
                  : property.key.name;
              styleProperties.push({
                name: propertyName,
                value: property.value.value,
                location: property.loc,
              });
            }
          }
        }
      }
    },
  });

  return styleProperties;
};
