/** biome-ignore-all lint/nursery/noNestedComponentDefinitions: There are no components here, just visitor functions */
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
        const snakeCasedName = name.replaceAll(
          /[A-Z]/g,
          (capitalLetter) => `-${capitalLetter}`,
        );
        styleProperties.push({
          location: nodePath.node.loc,
          name: snakeCasedName,
          value,
        });
      }
    }
  }

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
