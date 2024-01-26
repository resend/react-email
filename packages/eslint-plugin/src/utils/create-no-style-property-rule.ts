import { createRule } from "./create-rule";
import { sourceCodeFromLocation } from "./eslint/source-code-from-location";
import { getRuleListenersForJSXStyleProperties } from "./get-rule-listeners-for-jsx-style-properties";

export const createNoStylePropertyRule = (
  propertyNameOrNames: string[] | string,
  supportPercentage: number,
  caniemailLink: string,
) => {
  const propertyNames = Array.isArray(propertyNameOrNames)
    ? propertyNameOrNames
    : [propertyNameOrNames];
  const support = supportPercentage.toFixed(2);
  const messages = {
    "not-supported-on-most-email-clients": `"{{property}}" — support is ${support}% of email clients

${caniemailLink}`,
  };
  return createRule({
    meta: {
      type: "suggestion",
      schema: [],
      messages,
    },
    create(context) {
      const camelCasedPropertyNames = propertyNames.map((p) =>
        p.replace(/-[a-z]/g, (g) => g[1].toUpperCase()),
      );

      const isStylePropertyDisallowed = (name: string) => {
        return camelCasedPropertyNames.includes(name);
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
              data: {
                property: sourceCodeFromLocation(context.sourceCode, location),
              },
            });
          } else {
            const node = nodeOrLocation;
            context.report({
              node,
              messageId: "not-supported-on-most-email-clients",
              data: {
                property: context.sourceCode.getText(node),
              },
            });
          }
        },
      );
    },
  });
};
