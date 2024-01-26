import { createRule } from "./create-rule";

export const createNoHTMLAttributeRule = (
  attributeName: string,
  supportPercentage: number,
  caniemailLink: string,
) => {
  const support = supportPercentage.toFixed(2);
  return createRule({
    meta: {
      type: "suggestion",
      schema: [],
      messages: {
        "not-supported-on-most-email-clients": `${attributeName} — support is ${support}% of email clients

${caniemailLink}`,
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
