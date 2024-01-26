import { createRule } from "./create-rule";
import { getRuleListenersForJSXStyleProperties } from "./get-rule-listeners-for-jsx-style-properties";

export const createNoStyleValueForProperty = (
  valueToDisallow: string,
  property: string,
  supportPercentage: number,
  caniemailLink: string,
) => {
  const support = supportPercentage.toFixed(2);
  return createRule({
    meta: {
      type: "suggestion",
      schema: [],
      messages: {
        "not-supported-on-most-email-clients": `"${property}: ${valueToDisallow}" — support is ${support}% of email clients

${caniemailLink}`,
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
