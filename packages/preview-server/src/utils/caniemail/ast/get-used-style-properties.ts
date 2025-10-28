/** biome-ignore-all lint/nursery/noNestedComponentDefinitions: There are no components here, just visitor functions */
import traverse from '@babel/traverse';
import type { AST } from '../../../actions/email-validation/check-compatibility';
import { generateTailwindCssRules } from '../tailwind/generate-tailwind-rules';
import { getTailwindMetadata } from '../tailwind/get-tailwind-metadata';
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

export const getUsedStyleProperties = async (
  ast: AST,
  sourceCode: string,
  sourcePath: string,
  objectVariables: ObjectVariables,
) => {
  const styleProperties: StylePropertyUsage[] = [];
  const tailwindMetadata = await getTailwindMetadata(
    ast,
    sourceCode,
    sourcePath,
  );

  if (tailwindMetadata.hasTailwind) {
    traverse(ast, {
      JSXAttribute(path) {
        if (path.node.name.name === 'className') {
          path.traverse({
            StringLiteral(stringPath) {
              const className = stringPath.node.value;
              const { rules } = generateTailwindCssRules(
                className.split(' '),
                tailwindMetadata.context,
              );
              for (const rule of rules) {
                rule.walkDecls((decl) => {
                  styleProperties.push({
                    location: stringPath.node.loc,
                    name: decl.prop,
                    value: decl.value,
                  });
                });
              }
            },
          });
        }
      },
    });
  }

  traverse(ast, {
    JSXAttribute(path) {
      if (
        path.node.value?.type === 'JSXExpressionContainer' &&
        path.node.name.name === 'style'
      ) {
        if (path.node.value.expression.type === 'Identifier') {
          const styleVariable =
            objectVariables[path.node.value.expression.name];
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
        } else if (path.node.value.expression.type === 'ObjectExpression') {
          for (const property of path.node.value.expression.properties) {
            if (property.type === 'ObjectProperty') {
              if (property.computed) {
                continue;
              }

              const name = (() => {
                if (property.key.type === 'StringLiteral') {
                  return property.key.value;
                }
                if (property.key.type === 'Identifier') {
                  return property.key.name;
                }
              })();

              if (name === undefined) {
                continue;
              }

              const value = (() => {
                if (property.value.type === 'StringLiteral') {
                  return property.value.value;
                }
                if (property.value.type === 'NumericLiteral') {
                  return property.value.value.toString();
                }
              })();
              if (value === undefined) {
                continue;
              }

              styleProperties.push({
                name,
                value,
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
