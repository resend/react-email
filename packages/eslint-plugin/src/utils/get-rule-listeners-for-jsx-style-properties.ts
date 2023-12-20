import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import type {
  RuleListener,
  SourceCode,
} from "@typescript-eslint/utils/ts-eslint";

/**
 * Very useful because it keeps track of variables and weather they are being used on jsx
 * elements or not to warn the user about the problems with the properties
 */
export const getRuleListenersForJSXStyleProperties = (
  isStyleDisallowed: (
    stylePropertyName: string,
    stylePropertyValue: string,
  ) => boolean,

  sourceCode: Readonly<SourceCode>,
  reportProblemFor: (node: TSESTree.Node) => void,
): RuleListener => {
  const accumulatedProblemPropertiesPerVariableName = new Map<
    string,
    TSESTree.Property[]
  >();

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

  return {
    'JSXAttribute[name.name="style"] > JSXExpressionContainer ObjectExpression > Property'(
      node: TSESTree.Property,
    ) {
      const [propertyName, propertyValue] = metadataFromPropertyNode(node);
      if (isStyleDisallowed(propertyName, propertyValue)) {
        reportProblemFor(node);
      }
    },
    // we can't directly get the ObjectExpression from VariableDeclarator
    // because it can be wrapped with something like TSAsExpression
    // which might cause issues here
    "VariableDeclarator ObjectExpression > Property"(node: TSESTree.Property) {
      const [propertyName, propertyValue] = metadataFromPropertyNode(node);
      if (isStyleDisallowed(propertyName, propertyValue)) {
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
