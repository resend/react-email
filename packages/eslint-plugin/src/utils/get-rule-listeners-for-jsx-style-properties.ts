import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import esquery from 'esquery';
import type {
  RuleListener,
  SourceCode,
} from "@typescript-eslint/utils/ts-eslint";
import { getSourceCodeTailwindMetadata } from "./tailwind/get-source-code-tailwind-metadata";
import { generateTailwindCssRules } from "./tailwind/generate-tailwind-css-rules";

/**
 * Very useful because it keeps track of variables and weather they are being used on jsx
 * elements or not to warn the user about the problems with the properties
 */
export const getRuleListenersForJSXStyleProperties = (
  isStylePropertyDisallowed: (
    stylePropertyName: string,
    stylePropertyValue: string,
  ) => boolean,

  sourceCode: Readonly<SourceCode>,
  reportProblemFor: (
    nodeOrLocation: TSESTree.Node | TSESTree.SourceLocation,
  ) => void,
): RuleListener => {
  const ruleListener: RuleListener = {};

  const metadataFromPropertyNode = (node: TSESTree.Property) => {
    const [propertyName] = sourceCode
      .getText(node.key)
      .trim()
      .match(/\w+/g) ?? [""];
    const [propertyValue] = sourceCode
      .getText(node.value)
      .trim()
      .match(/[\w\s-]+/g) ?? [""];
    return [propertyName, propertyValue] as const;
  };

  const tailwindMetadata = getSourceCodeTailwindMetadata(sourceCode);

  if (tailwindMetadata.hasTailwind) {
    const tailwindContext = tailwindMetadata.tailwindContext;

    type Property = [name: string, value: string];

    const getTailwindStylePropertiesForClassNameAttribute = (
      classNameAttribute: string,
    ) => {
      const propertiesPerClassname = new Map<string, Property[]>();

      for (const className of classNameAttribute.split(" ")) {
        for (const rule of generateTailwindCssRules([className], tailwindContext).rules) {
          const properties = [] as Property[];
          rule.walk((node) => {
            if (node.type === "decl") {
              properties.push([node.prop, node.value]);
            }
          });
          propertiesPerClassname.set(className, properties);
        }
      }

      return propertiesPerClassname;
    };

    ruleListener['JSXAttribute[name.name="className"] Literal'] = (node: TSESTree.Literal) => {
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
            if (isStylePropertyDisallowed(name, value)) {
              reportProblemFor({
                start: {
                  line: node.loc.start.line,
                  column: node.loc.start.column + start,
                },
                end: {
                  line: node.loc.start.line,
                  column: node.loc.start.column + end,
                },
              });
            }
          }
        }
      }
    }
  }

  const accumulatedProblemPropertiesPerVariableName = new Map<
    string,
    TSESTree.Property[]
  >();

  // we can't directly get the ObjectExpression from VariableDeclarator
  // because it can be wrapped with something like TSAsExpression
  // which might cause issues here
  for (const node of (esquery(sourceCode.ast, "VariableDeclarator ObjectExpression > Property") as TSESTree.Property[])) {
    const [propertyName, propertyValue] = metadataFromPropertyNode(node);
    if (isStylePropertyDisallowed(propertyName, propertyValue)) {
      const variableNode = sourceCode.getAncestors!(node).findLast(
        (ancestor) => ancestor.type === AST_NODE_TYPES.VariableDeclarator,
      ) as TSESTree.VariableDeclarator;
      const variableName = sourceCode.getText(variableNode.id);

      const lastProblemProperties =
        accumulatedProblemPropertiesPerVariableName.get(variableName) ?? [];

      accumulatedProblemPropertiesPerVariableName.set(variableName, [
        ...lastProblemProperties,
        node,
      ]);
    }
  }

  return {
    ...ruleListener,
    'JSXAttribute[name.name="style"] > JSXExpressionContainer ObjectExpression > Property'(
      node: TSESTree.Property,
    ) {
      const [propertyName, propertyValue] = metadataFromPropertyNode(node);
      if (isStylePropertyDisallowed(propertyName, propertyValue)) {
        reportProblemFor(node);
      }
    },
    'JSXAttribute[name.name="style"] JSXExpressionContainer Identifier'(
      node: TSESTree.Identifier,
    ) {
      const dirtyStyleVariableIdentifier =
        accumulatedProblemPropertiesPerVariableName.get(node.name);
      if (typeof dirtyStyleVariableIdentifier !== "undefined") {
        for (const problem of dirtyStyleVariableIdentifier) {
          reportProblemFor(problem);
        }
      }
    },
  };
};
