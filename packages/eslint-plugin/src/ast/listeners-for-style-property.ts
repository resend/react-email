import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import esquery from "esquery";
import { camelCase } from "change-case";
import type {
  RuleListener,
  SourceCode,
} from "@typescript-eslint/utils/ts-eslint";
import { getSourceCodeTailwindMetadata } from "./tailwind/get-source-code-tailwind-metadata";
import { generateTailwindCssRules } from "./tailwind/generate-tailwind-css-rules";
import { propertyNameAndValueFromNode } from "./property-name-and-value-from-node";

/**
 * Defines eslint rule listeners based on the sourceCode from the eslint rule context and uses them
 * to determine if CSS usages are happening based on the {@link stylePropertyMatcher} function.
 *
 * It does two things that makes its existance justified:
 * 1. It handles the use case where the styles are defined in a variable and then used in the JSX.
 * 2. It handles the use case where the styles are defined with Tailwind
 *
 * Both of these makes the experience a bit better for the user depending on the way they choose
 * to write their styles.
 *
 * Once the listeners are attached to the rule context, every time it finds a style property it calls
 * the {@link callback} function provided.
 */
export const listenersForStyleProperty = (
  sourceCode: Readonly<SourceCode>,
  filename: string,

  callback: (
    prooperty: {
      /**
       * The name of the property in a camel cased form.
       *
       * Example: background-color -\> backgroundColor
       */
      name: string;
      value: string;
    },
    nodeOrLocation:
      | TSESTree.Property
      | {
          location: [start: TSESTree.Position, end: TSESTree.Position];
        },
  ) => void,
): RuleListener => {
  const ruleListeners: RuleListener = {};

  const tailwindMetadata = getSourceCodeTailwindMetadata(sourceCode, filename);

  if (tailwindMetadata.hasTailwind) {
    const tailwindContext = tailwindMetadata.tailwindContext;

    type Property = [name: string, value: string];

    const getTailwindStylePropertiesForClassNameAttribute = (
      classNameAttribute: string,
    ) => {
      const propertiesPerClassname = new Map<string, Property[]>();

      for (const className of classNameAttribute.split(" ")) {
        for (const rule of generateTailwindCssRules(
          [className],
          tailwindContext,
        ).rules) {
          const properties = [] as Property[];
          rule.walk((node) => {
            if (node.type === "decl") {
              // we need to turn the snake-case property name into camel case
              // because that is what the JSX styles actually use, so to keep things
              // simple with the {name, value} object for the property's metadata
              // we keep the name always camel case
              properties.push([camelCase(node.prop), node.value]);
            }
          });
          propertiesPerClassname.set(className, properties);
        }
      }

      return propertiesPerClassname;
    };

    ruleListeners['JSXAttribute[name.name="className"] Literal'] = (
      node: TSESTree.Literal,
    ) => {
      const classNameAttribute = node.value;
      if (typeof classNameAttribute === "string") {
        const propertiesForClassName =
          getTailwindStylePropertiesForClassNameAttribute(classNameAttribute);
        for (const [
          className,
          properties,
        ] of propertiesForClassName.entries()) {
          const start = classNameAttribute.indexOf(className) + 1;
          const end = start + className.length;

          for (const [name, value] of properties) {
            callback(
              { name, value },
              {
                location: [
                  {
                    line: node.loc.start.line,
                    column: node.loc.start.column + start,
                  },
                  {
                    line: node.loc.start.line,
                    column: node.loc.start.column + end,
                  },
                ],
              },
            );
          }
        }
      }
    };
  }

  const accumulatedProblemPropertiesPerVariableName = new Map<
    string,
    TSESTree.Property[]
  >();

  // we can't directly get the ObjectExpression from VariableDeclarator
  // because it can be wrapped with something like TSAsExpression
  // which might cause issues here
  for (const node of esquery(
    sourceCode.ast,
    "VariableDeclarator ObjectExpression > Property",
  ) as TSESTree.Property[]) {
    const variableNode = sourceCode.getAncestors!(node).findLast(
      (ancestor) => ancestor.type === AST_NODE_TYPES.VariableDeclarator,
    ) as TSESTree.VariableDeclarator;
    if (variableNode.id.type !== AST_NODE_TYPES.Identifier) continue;

    const variableName = variableNode.id.name;

    const lastProblemProperties =
      accumulatedProblemPropertiesPerVariableName.get(variableName) ?? [];

    accumulatedProblemPropertiesPerVariableName.set(variableName, [
      ...lastProblemProperties,
      node,
    ]);
  }

  return {
    ...ruleListeners,
    'JSXAttribute[name.name="style"] > JSXExpressionContainer ObjectExpression > Property'(
      property: TSESTree.Property,
    ) {
      callback(propertyNameAndValueFromNode(property, sourceCode), property);
    },
    // matches something like <div style={{IDENTIFIER}} /> meaning that it can be a variable or something
    // else
    //
    // we check if it is an actuall variable by basically querying the AST for all variables beforehand
    // and looking into this map of variables
    'JSXAttribute[name.name="style"] JSXExpressionContainer Identifier'(
      node: TSESTree.Identifier,
    ) {
      const propertiesForVariable =
        accumulatedProblemPropertiesPerVariableName.get(node.name);

      if (typeof propertiesForVariable !== "undefined") {
        for (const property of propertiesForVariable) {
          callback(
            propertyNameAndValueFromNode(property, sourceCode),
            property,
          );
        }
      }
    },
  };
};
