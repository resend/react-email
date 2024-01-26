import { createRule } from "./create-rule";
import { sourceCodeFromLocation } from "./eslint/source-code-from-location";
import { getRuleListenersForJSXStyleProperties } from "./get-rule-listeners-for-jsx-style-properties";

export const createNoStyleValueKeywordRule = (
  valueKeywordOrKeywords: string[] | string,
  supportPercentage: number,
  caniemailLink: string,
  message?: string,
) => {
  const valueKeywords = Array.isArray(valueKeywordOrKeywords)
    ? valueKeywordOrKeywords
    : [valueKeywordOrKeywords];

  const support = supportPercentage.toFixed(2);
  const definedMessageOrDefault =
    message ??
    `"{{value}}" — support is ${support}% of email clients

${caniemailLink}`;
  return createRule({
    meta: {
      type: "suggestion",
      schema: [],
      messages: {
        "not-supported-on-most-email-clients": definedMessageOrDefault,
      },
    },
    create(context) {
      const isStylePropertyDisallowed = (_name: string, value: string) =>
        valueKeywords.some((keyword) =>
          value.match(new RegExp(`(\\b|^)${keyword}(\\b|$)`, "g")),
        );

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
                value: sourceCodeFromLocation(context.sourceCode, location),
              },
            });
          } else {
            const node = nodeOrLocation;
            context.report({
              node,
              messageId: "not-supported-on-most-email-clients",
              data: {
                value: context.sourceCode.getText(node),
              },
            });
          }
        },
      );
    },
  });
};
