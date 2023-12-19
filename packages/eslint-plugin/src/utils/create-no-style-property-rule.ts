/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { createRule } from "./create-rule";
import type { ArgsOf } from "./types/args-of";

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
      type ProblemReport = ArgsOf<typeof context.report>[0];
      const variableWithPossiblyUnallowedProperty = new Map<string, ProblemReport[]>();
      const camelCasedProperties = propertyNames.map((p) =>
        p.replace(/-[a-z]/g, (g) => g[1].toUpperCase()),
      );
      return {
        'JSXAttribute[name.name="style"] > JSXExpressionContainer ObjectExpression > Property'(
          node: TSESTree.Property,
        ) {
          const [attributeName] = context.sourceCode
            .getText(node.key)
            .trim()
            .match(/\w+/g) ?? [""]; // only select the word
          if (camelCasedProperties.includes(attributeName)) {
            context.report({
              node,
              messageId: "not-supported-on-most-email-clients",
            });
          }
        },
        // we can't directly get the ObjectExpression from VariableDeclarator
        // because it can be wrapped with something like TSAsExpression (not sure if that's the exact name)
        // which might cause issues here
        "VariableDeclarator ObjectExpression > Property"(
          node: TSESTree.Property & {
            parent: TSESTree.ObjectExpression;
          },
        ) {
          const variableNode = context.sourceCode
            .getAncestors!(node)
            .findLast(ancestor => ancestor.type === AST_NODE_TYPES.VariableDeclarator) as TSESTree.VariableDeclarator;
          const [attributeName] = context.sourceCode
            .getText(node.key)
            .trim()
            .match(/\w+/g) ?? [""]; // only select the word
          if (
            camelCasedProperties.includes(attributeName) &&
            "name" in variableNode.id
          ) {
            const variableName = variableNode.id.name;

            const lastReportedProblems = variableWithPossiblyUnallowedProperty.get(variableName) ?? [];

            variableWithPossiblyUnallowedProperty.set(variableName, [...lastReportedProblems, {
              messageId: 'not-supported-on-most-email-clients',
              node
            }]);
          }
        },
        'JSXAttribute[name.name="style"] JSXExpressionContainer Identifier'(
          node: TSESTree.Identifier & {
            parent: TSESTree.JSXExpressionContainer & {
              parent: TSESTree.JSXAttribute;
            };
          }
        ) {
          const dirtyStyleVariableIdentifier = variableWithPossiblyUnallowedProperty.get(node.name);
          if (typeof dirtyStyleVariableIdentifier !== 'undefined') {
            for (const problem of dirtyStyleVariableIdentifier) {
              context.report(problem);
            }
          }
        },
      };
    },
  });
};
