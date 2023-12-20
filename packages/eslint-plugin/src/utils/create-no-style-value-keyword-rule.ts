import { createRule } from "./create-rule";
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
  const isRuleForMultipleValues = valueKeywords.length > 1;

  const definedMessageOrDefault =
    message ??
    `The CSS ${isRuleForMultipleValues ? "values" : "value"
    } ${valueKeywords.join(", ")} ${isRuleForMultipleValues ? "are" : "is"
    } only supported on ${supportPercentage.toFixed(
      2,
    )}% of email clients, see ${caniemailLink}`;
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
        (node) => {
          context.report({
            node,
            messageId: "not-supported-on-most-email-clients",
          });
        },
      );
    },
  });
};
