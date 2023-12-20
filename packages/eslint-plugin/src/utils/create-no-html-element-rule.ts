import { createRule } from "./create-rule";

export const createNoHTMLElementRule = (
  disallowedElementName: string,
  supportPercentage: number,
  caniemailLink: string,
) => {
  return createRule({
    meta: {
      type: "suggestion",
      schema: [],
      messages: {
        "not-supported-on-most-email-clients": `The HTML element ${disallowedElementName} is only supported on ${supportPercentage.toFixed(
          2,
        )}% of email clients, see ${caniemailLink}`,
      },
    },
    create(context) {
      return {
        JSXOpeningElement(node) {
          const elementName = context.sourceCode.getText(node.name);

          if (elementName === disallowedElementName) {
            context.report({
              node: node.name,
              messageId: "not-supported-on-most-email-clients",
            });
          }
        },
      };
    },
  });
};
