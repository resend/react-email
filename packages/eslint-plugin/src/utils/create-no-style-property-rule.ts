import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule } from "./create-rule";

export const createNoStylePropertyRule = (propertyNameOrNames: string[] | string, supportPercentage: number, caniemailLink: string) => {
  const propertyNames = Array.isArray(propertyNameOrNames) ? propertyNameOrNames : [propertyNameOrNames];
  const isRuleForMultipleProperties = propertyNames.length > 1;
  return createRule({
    meta: {
      type: "suggestion",
      schema: [],
      messages: {
        'not-supported-on-most-email-clients': `The CSS ${isRuleForMultipleProperties ? 'properties' : 'property'} ${propertyNames.join(', ')} ${isRuleForMultipleProperties ? 'are' : 'is'} only supported on ${supportPercentage.toFixed(2)}% of email clients, see ${caniemailLink}`,
      },
    },
    create(context) {
      return {
        Property(node) {
          const camelCasedProperties = propertyNames.map(
            p => p.replace(/-[a-z]/g, (g) => g[1].toUpperCase())
          );

          const [attributeName] = context.sourceCode.getText(node.key)
            .trim()
            .match(/\w+/g) ?? ['']; // only select the word

          if (
            node.parent.type === AST_NODE_TYPES.ObjectExpression &&
            node.parent.parent.type === AST_NODE_TYPES.JSXExpressionContainer &&
            node.parent.parent.parent.type === AST_NODE_TYPES.JSXAttribute &&
            context.sourceCode.getText(node.parent.parent.parent.name) === "style" &&
            camelCasedProperties.includes(attributeName)
          ) {
            context.report({
              node,
              messageId: 'not-supported-on-most-email-clients'
            });
          }
        },
      };
    },
  });
}
