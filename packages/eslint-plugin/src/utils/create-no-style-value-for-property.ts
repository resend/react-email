import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule } from "./create-rule";

export const createNoStyleValueForProperty = (
  value: string,
  property: string,
  supportPercetange: number,
  caniemailLink: string,
) => {
  return createRule({
    meta: {
      type: 'suggestion',
      schema: [],
      messages: {
        'not-supported-on-most-emails-clients': `The style ${property}: ${value} is supported only ${supportPercetange.toFixed(2)}% of email clients, see ${caniemailLink}`
      }
    },
    create(context) {
      return {
        Property(node) {
          const camelCasedProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

          const [attributeName] = context.sourceCode.getText(node.key)
            .trim()
            .match(/\w+/g) ?? ['']; // only select the word

          if (
            node.parent.type === AST_NODE_TYPES.ObjectExpression &&
            node.parent.parent.type === AST_NODE_TYPES.JSXExpressionContainer &&
            node.parent.parent.parent.type === AST_NODE_TYPES.JSXAttribute &&
            context.sourceCode.getText(node.parent.parent.parent.name) === "style" &&
            context.sourceCode.getText(node.value).trim() === value &&
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
  });
};
