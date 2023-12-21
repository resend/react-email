import { createRule } from "./create-rule";
import { getRuleListenersForJSXStyleProperties } from "./get-rule-listeners-for-jsx-style-properties";

export const createNoStyleValueForProperty = (
  valueToDisallow: string,
  property: string,
  supportPercetange: number,
  caniemailLink: string,
) => {
  return createRule({
    meta: {
      type: "suggestion",
      schema: [],
      messages: {
        "not-supported-on-most-email-clients": `The style ${property}: ${valueToDisallow} is supported in only ${supportPercetange.toFixed(
          2,
        )}% of email clients, see ${caniemailLink}`,
      },
    },
    create(context) {
      const camelCasedPropertyName = property.replace(/-[a-z]/g, (g) =>
        g[1].toUpperCase(),
      );

      const isStylePropertyDisallowed = (name: string, value: string) => {
        return (
          value.trim() === valueToDisallow && camelCasedPropertyName === name
        );
      };

      return getRuleListenersForJSXStyleProperties(
        isStylePropertyDisallowed,
        context.sourceCode,
        (nodeOrLocation) => {
          if ("start" in nodeOrLocation) {
            const location = nodeOrLocation;
            context.report({
              loc: location,
              messageId: "not-supported-on-most-email-clients",
            });
          } else {
            const node = nodeOrLocation;
            context.report({
              node,
              messageId: "not-supported-on-most-email-clients",
            });
          }
        },
      );
    },
  });
};
