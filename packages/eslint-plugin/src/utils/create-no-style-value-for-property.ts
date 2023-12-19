import type { TSESTree } from "@typescript-eslint/utils";
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
        "not-supported-on-most-emails-clients": `The style ${property}: ${valueToDisallow} is supported in only ${supportPercetange.toFixed(
          2,
        )}% of email clients, see ${caniemailLink}`,
      },
    },
    create(context) {
      const camelCasedProperty = property.replace(/-[a-z]/g, (g) =>
        g[1].toUpperCase(),
      );

      const isStylePropertyDisallowed = (node: TSESTree.Property) => {
        const [stylePropertyName] = context.sourceCode
          .getText(node.key)
          .trim()
          .match(/\w+/g) ?? [""]; // only select the word
        const [value] = context.sourceCode
          .getText(node.value)
          .trim()
          .match(/[\w\s-]+/g) ?? [""];

        return (
          value.trim() === valueToDisallow &&
          camelCasedProperty === stylePropertyName
        );
      };

      return getRuleListenersForJSXStyleProperties(
        isStylePropertyDisallowed,
        context.sourceCode,
        (node) => {
          context.report({
            node,
            messageId: "not-supported-on-most-emails-clients",
          });
        },
      );
    },
  });
};
