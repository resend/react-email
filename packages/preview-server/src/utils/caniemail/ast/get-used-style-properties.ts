import traverse, { type NodePath } from '@babel/traverse';
import { inlineStyles, sanitizeStyleSheet } from '@react-email/tailwind';
import type { StyleSheet } from 'css-tree';
import type { AST } from '../../../actions/email-validation/check-compatibility';
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
    const pathClassNameMap = new Map<string, NodePath>();

    traverse(ast, {
      JSXAttribute(path) {
        if (path.node.name.name === 'className') {
          path.traverse({
            StringLiteral(stringPath) {
              const className = stringPath.node.value;
              pathClassNameMap.set(className, stringPath);
              const candidates = className.split(/\s+/);
              tailwindMetadata.tailwindSetup.addUtilities(candidates);
            },
          });
        }
      },
    });
    const styleSheet =
      tailwindMetadata.tailwindSetup.getStyleSheet() as StyleSheet;
    sanitizeStyleSheet(styleSheet);

    for (const [className, nodePath] of pathClassNameMap.entries()) {
      const styles = inlineStyles(styleSheet, className.split(/\s+/));
      for (const [name, value] of Object.entries(styles)) {
        styleProperties.push({
          location: nodePath.node.loc,
          name,
          value,
        });
      }
    }
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
