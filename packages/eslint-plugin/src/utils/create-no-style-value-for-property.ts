import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule } from "./create-rule";

export const createNoStyleValueForProperty = (
  valueToDisallow: string,
  property: string,
  supportPercetange: number,
  caniemailLink: string,
) => {
  return createRule({
    meta: {
      type: 'suggestion',
      schema: [],
      messages: {
        'not-supported-on-most-emails-clients': `The style ${property}: ${valueToDisallow} is supported only ${supportPercetange.toFixed(2)}% of email clients, see ${caniemailLink}`
      }
    },
    create(context) {
      return {
        Property(node) {
          if (
            node.parent.type === AST_NODE_TYPES.ObjectExpression &&
            node.parent.parent.type === AST_NODE_TYPES.JSXExpressionContainer &&
            node.parent.parent.parent.type === AST_NODE_TYPES.JSXAttribute
          ) {
            const camelCasedProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

            const [attributeName] = context.sourceCode.getText(node.key)
              .trim()
              .match(/\w+/g) ?? ['']; // only select the word
            const [value] = context.sourceCode.getText(node.value)
              .trim()
              .match(/[\w\s-]+/g) ?? [''];

            if (
              context.sourceCode.getText(node.parent.parent.parent.name) === "style" &&
              value.trim() === valueToDisallow &&
              camelCasedProperty === attributeName
            ) {
              context.report({
                node,
                messageId: 'not-supported-on-most-emails-clients'
              });
            }
          }
        }
      }
    }
  });
};
