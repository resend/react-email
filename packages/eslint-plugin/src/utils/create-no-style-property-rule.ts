import { type TSESTree } from "@typescript-eslint/utils";
import { createRule } from "./create-rule";
import { getRuleListenersForJSXStyleProperties } from "./get-rule-listeners-for-jsx-style-properties";

export const createNoStylePropertyRule = (
  propertyNameOrNames: string[] | string,
  supportPercentage: number,
  caniemailLink: string,
) => {
  const propertyNames = Array.isArray(propertyNameOrNames)
    ? propertyNameOrNames
    : [propertyNameOrNames];
  const isRuleForMultipleProperties = propertyNames.length > 1;
  return createRule({
    meta: {
      type: "suggestion",
      schema: [],
      messages: {
        "not-supported-on-most-email-clients": `The CSS ${isRuleForMultipleProperties ? "properties" : "property"
          } ${propertyNames.join(", ")} ${isRuleForMultipleProperties ? "are" : "is"
          } only supported on ${supportPercentage.toFixed(
            2,
          )}% of email clients, see ${caniemailLink}`,
      },
    },
    create(context) {
      const camelCasedProperties = propertyNames.map((p) =>
        p.replace(/-[a-z]/g, (g) => g[1].toUpperCase()),
      );

      const isStylePropertyDisallowed = (node: TSESTree.Property) => {
        const [attributeName] = context.sourceCode
          .getText(node.key)
          .trim()
          .match(/\w+/g) ?? [""]; // only select the word
        return camelCasedProperties.includes(attributeName);
      };

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
