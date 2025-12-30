import traverse, { type Node, type NodePath } from '@babel/traverse';
import { inlineStyles, sanitizeStyleSheet } from '@react-email/tailwind';
import type { StyleSheet } from 'css-tree';
import type { AST } from '../../../actions/email-validation/check-compatibility';
import { getTailwindMetadata } from '../tailwind/get-tailwind-metadata';

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

function writtenMemberExpressionTo(
  nodePath: NodePath | null | undefined,
  accumulated = '',
): string {
  if (!nodePath) return accumulated;
  if (nodePath.parent.type === 'VariableDeclarator') {
    if (nodePath.parent.id.type === 'Identifier') {
      const variableName = nodePath.parent.id.name;
      return accumulated.length === 0
        ? variableName
        : `${variableName}.${accumulated}`;
    }
  } else if (nodePath.parent.type === 'ObjectProperty') {
    if (nodePath.parent.key.type === 'Identifier') {
      const propertyName = nodePath.parent.key.name;
      return writtenMemberExpressionTo(
        nodePath.parentPath?.parentPath,
        accumulated.length === 0
          ? propertyName
          : `${propertyName}.${accumulated}`,
      );
    }
  }
  throw new Error(
    'Unexpected style object structure, this is a bug in the compatibility checker',
    {
      cause: {
        nodePath,
        accumulated,
      },
    },
  );
}

export const getUsedStyleProperties = async (
  ast: AST,
  sourceCode: string,
  sourcePath: string,
) => {
  const possibleStyleObjects: Record<string, ObjectProperty[]> = {};
  traverse(ast, {
    ObjectExpression(nodePath) {
      if (
        nodePath.parent.type !== 'VariableDeclarator' &&
        nodePath.parent.type !== 'ObjectProperty'
      ) {
        return;
      }
      const memberExpression = writtenMemberExpressionTo(nodePath);
      const properties: ObjectProperty[] = [];
      for (const property of nodePath.node.properties) {
        if (property.type === 'ObjectProperty') {
          properties.push(property);
        }
      }
      possibleStyleObjects[memberExpression] = properties;
    },
  });

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

  function stylePropertyFrom(objectProperty: Node) {
    if (objectProperty.type === 'ObjectProperty') {
      if (objectProperty.computed) {
        return;
      }

      const name = (() => {
        if (objectProperty.key.type === 'StringLiteral') {
          return objectProperty.key.value;
        }
        if (objectProperty.key.type === 'Identifier') {
          return objectProperty.key.name;
        }
      })();

      if (name === undefined) {
        return;
      }

      const value = (() => {
        if (objectProperty.value.type === 'StringLiteral') {
          return objectProperty.value.value;
        }
        if (objectProperty.value.type === 'NumericLiteral') {
          return objectProperty.value.value.toString();
        }
      })();
      if (value === undefined) {
        return;
      }

      return {
        name,
        value,
        location: objectProperty.loc,
      };
    }
  }

  traverse(ast, {
    JSXAttribute(path) {
      if (
        path.node.value?.type === 'JSXExpressionContainer' &&
        path.node.name.name === 'style'
      ) {
        if (
          path.node.value.expression.type === 'MemberExpression' ||
          path.node.value.expression.type === 'Identifier'
        ) {
          if (
            !path.node.value.expression.start ||
            !path.node.value.expression.end
          ) {
            throw new Error(
              'Missing start and end for jsx expression container value, this is a bug in the compatibility checker',
              {
                cause: {
                  path,
                },
              },
            );
          }
          const styleDefinition =
            possibleStyleObjects[
              sourceCode.slice(
                path.node.value.expression.start,
                path.node.value.expression.end,
              )
            ];
          if (styleDefinition) {
            for (const objectProperty of styleDefinition) {
              const styleProperty = stylePropertyFrom(objectProperty);
              if (!styleProperty) continue;
              styleProperties.push(styleProperty);
            }
          }
        } else if (path.node.value.expression.type === 'ObjectExpression') {
          for (const objectProperty of path.node.value.expression.properties) {
            const styleProperty = stylePropertyFrom(objectProperty);
            if (!styleProperty) continue;
            styleProperties.push(styleProperty);
          }
        }
      }
    },
  });

  return styleProperties;
};
