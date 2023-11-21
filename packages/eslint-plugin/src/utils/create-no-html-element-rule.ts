import { createRule } from "./create-rule"

export const createNoHTMLElementRule = (elementName: string, supportPercentage: number, caniemailLink: string) => {
  return createRule({
    meta: {
      type: 'suggestion',
      schema: [],
      messages: {
        'not-supported-on-most-email-clients': `The HTML element ${elementName} is only supported on ${supportPercentage.toFixed(2)}% of email clients, see ${caniemailLink}`
      },
    },
    create(context) {
      return {
        JSXOpeningElement(node) {
          const name = context.sourceCode.getText(node.name);

          if (name === elementName) {
            context.report({
              node,
              messageId: 'not-supported-on-most-email-clients'
            });
          }
        }
      };
    }
  });
}
