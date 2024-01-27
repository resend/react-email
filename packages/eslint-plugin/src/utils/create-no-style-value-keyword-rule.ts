import { createRule } from "./create-rule";
import { sourceCodeFromLocation } from "./eslint/source-code-from-location";
import { getRuleListenersForJSXStyleProperties } from "./get-rule-listeners-for-jsx-style-properties";

export const createNoStyleValueKeywordRule = (
  valueKeywordOrKeywordsRegexes: (RegExp | string)[] | (RegExp | string),
  supportPercentage: number,
  caniemailLink: string,
  message?: string,
) => {
  const valueKeywords = Array.isArray(valueKeywordOrKeywordsRegexes)
    ? valueKeywordOrKeywordsRegexes
    : [valueKeywordOrKeywordsRegexes];

  const support = supportPercentage.toFixed(2);
  const definedMessageOrDefault =
    message ??
    `{{value}} — support is ${support}% of email clients

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
      const isStylePropertyDisallowed = (_name: string, value: string) => {
        return valueKeywords.some((keyword) => Boolean(value.match(keyword)));
      };

      return getRuleListenersForJSXStyleProperties(
        isStylePropertyDisallowed,
        context.sourceCode,
        (nodeOrLocationObject) => {
          if ("location" in nodeOrLocationObject) {
            const { location } = nodeOrLocationObject;
            context.report({
              loc: {
                start: location[0],
                end: location[1],
              },
              messageId: "not-supported-on-most-email-clients",
              data: {
                value: sourceCodeFromLocation(context.sourceCode, location),
              },
            });
          } else {
            const node = nodeOrLocationObject;
            context.report({
              node,
              messageId: "not-supported-on-most-email-clients",
              data: {
                value: context.sourceCode.getText(node.value),
              },
            });
          }
        },
      );
    },
  });
};
