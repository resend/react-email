import { createRule } from "./create-rule";

export const createNoHTMLAttributeRule = (
  attributeName: string,
  supportPercentage: number,
  caniemailLink: string,
) => {
  return createRule({
    meta: {
      type: "suggestion",
      schema: [],
      messages: {
        "not-supported-on-most-email-clients": `The HTML attribute ${attributeName} is only supported on ${supportPercentage.toFixed(
          2,
        )}% of email clients, see ${caniemailLink}`,
      },
    },
    create(context) {
      return {
        JSXAttribute(node) {
          const name = context.sourceCode.getText(node.name);

          if (name === attributeName) {
            context.report({
              node,
              messageId: "not-supported-on-most-email-clients",
            });
          }
        },
      };
    },
  });
};
