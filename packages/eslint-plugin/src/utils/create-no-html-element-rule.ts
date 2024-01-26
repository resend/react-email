import { createRule } from "./create-rule";

export const createNoHTMLElementRule = (
  disallowedElementName: string,
  supportPercentage: number,
  caniemailLink: string,
) => {
  const support = supportPercentage.toFixed(2);
  return createRule({
    meta: {
      type: "suggestion",
      schema: [],
      messages: {
        "not-supported-on-most-email-clients": `<${disallowedElementName}> — support is ${support}% of email clients

${caniemailLink}`,
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
