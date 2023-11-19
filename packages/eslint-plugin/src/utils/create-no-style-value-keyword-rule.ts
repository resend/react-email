import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule } from "./create-rule";

export const createNoStyleValueKeywordRule = (
  valueKeywordOrKeywords: string[] | string, 
  supportPercentage: number, 
  caniemailLink: string, 
  message?: string
) => {
  const valueKeywords = Array.isArray(valueKeywordOrKeywords) ? valueKeywordOrKeywords : [valueKeywordOrKeywords];
  const isRuleForMultipleValues = valueKeywords.length > 1;

  const definedMessageOrDefault = message ?? `The CSS ${isRuleForMultipleValues ? 'values' : 'value'} ${valueKeywords.join(', ')} ${isRuleForMultipleValues ? 'are' : 'is'} only supported on ${supportPercentage.toFixed(2)}% of email clients, see ${caniemailLink}`;

  return createRule({
    meta: {
      type: "suggestion",
      schema: [],
      messages: {
        'not-supported-on-most-email-clients': definedMessageOrDefault,
      },
    },
    create(context) {
      return {
        Property(node) {
          const value = context.sourceCode.getText(node.value);
          if (
            node.parent.type === AST_NODE_TYPES.ObjectExpression &&
            node.parent.parent.type === AST_NODE_TYPES.JSXExpressionContainer &&
            node.parent.parent.parent.type === AST_NODE_TYPES.JSXAttribute &&
            context.sourceCode.getText(node.parent.parent.parent.name) === "style" &&
            valueKeywords.some((keyword) => value.includes(keyword))
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
