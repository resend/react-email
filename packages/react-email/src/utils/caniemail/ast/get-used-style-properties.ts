import type { SourceLocation } from 'acorn';
import * as walk from 'acorn-walk';
import type { JSXAttribute } from '../../acorn-typescript';
import type { AST } from '../../parser';
import { generateTailwindCssRules } from '../tailwind/generate-tailwind-rules';
import { getTailwindMetadata } from '../tailwind/get-tailwind-metadata';
import type { ObjectVariables } from './get-object-variables';

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
    walk.full(ast, (node, _) => {
      if (node.type === 'JSXAttribute') {
        const attribute = node as JSXAttribute;
        if (attribute.name.name === 'className') {
          walk.simple(attribute, {
            Literal(node) {
              if (node.value) {
                const className = node.value.toString();
                const { rules } = generateTailwindCssRules(
                  className.split(' '),
                  tailwindMetadata.context,
                );
                for (const rule of rules) {
                  rule.walkDecls((decl) => {
                    styleProperties.push({
                      location: node.loc,
                      name: decl.prop,
                      value: decl.value,
                    });
                  });
                }
              }
            },
          });
        }
      }
    });
  }

  walk.full(ast, (node) => {
    if (node.type === 'JSXAttribute') {
      const attribute = node as JSXAttribute;
      if (
        attribute.value?.type === 'JSXExpressionContainer' &&
        attribute.value.expression.type === 'Identifier' &&
        attribute.name.name === 'style'
      ) {
        const styleVariable = objectVariables[attribute.value.expression.name];
        if (styleVariable) {
          for (const property of styleVariable) {
            if (
              (property.key.type === 'Literal' ||
                property.key.type === 'Identifier') &&
              property.value.type === 'Literal'
            ) {
              const propertyName =
                property.key.type === 'Literal'
                  ? property.key.value
                  : property.key.name;
              if (propertyName && property.value.value) {
                styleProperties.push({
                  name: propertyName.toString(),
                  value: property.value.value.toString(),
                  location: property.loc,
                });
              }
            }
          }
        }
      }
    }
  });

  return styleProperties;
};
