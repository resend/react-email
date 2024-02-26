import type { TSESTree } from "@typescript-eslint/utils";
import { getReportingDataFromNodeOrLocationObject } from "./ast/get-reporting-data-from-node-or-location-object";
import { fromCaemlToKebabCase } from "./casing/from-camel-to-kebab-case";
import { createRule } from "./create-rule";
import { getPropertyTitlesFromSupportEntry } from "./data/get-property-titles-from-support-entry";
import type { SupportEntry } from "./data/support-response";
import { listenersForStyleProperty } from "./feature-usage/listeners-for-style-property";
import { findSupportEntryForPropertyAndValue } from "./data/find-support-entry-for-property-and-value";

export type SupportEntryWithVersionsInArray = SupportEntry & {
  supportPerVersion: { version: string; support: string }[];
};

/**
 * Creates a new eslint rule that is meant to report, as a problem, any occurrence
 * of unsupported features on the given platform.
 */
export function createNoUnsupportedOn(
  supportEntries: SupportEntryWithVersionsInArray[],
  platform: string,
) {
  const cssSupportEntries = supportEntries.filter(
    (entry) => entry.category === "css",
  );
  return createRule({
    meta: {
      type: "problem",
      schema: [],
      messages: {
        unsupported: `'{{feature}}' is not supported on ${platform} (versions {{versionsSeparatedByComma}}).`,
      },
    },
    create(context) {
      const reportForEntry = (
        entry: SupportEntryWithVersionsInArray | undefined,
        feature: string,
        nodeOrLocationObject:
          | TSESTree.Node
          | {
              location: [start: TSESTree.Position, end: TSESTree.Position];
            },
      ) => {
        if (entry !== undefined) {
          const unsupportedVersions = entry.supportPerVersion
            .filter((meta) => meta.support === "n")
            .map((meta) => meta.version);

          if (unsupportedVersions.length > 0) {
            context.report({
              ...getReportingDataFromNodeOrLocationObject(nodeOrLocationObject),
              messageId: "unsupported",
              data: {
                feature,
                versionsSeparatedByComma: unsupportedVersions.join(", "),
              },
            });
          }
        }
      };

      return {
        ...listenersForStyleProperty(
          context.sourceCode,
          (property, nodeOrLocationObject) => {
            const actualCSSProperty = fromCaemlToKebabCase(property.name);
            const supportEntryForProperty = cssSupportEntries.find((e) =>
              getPropertyTitlesFromSupportEntry(e.title, e.keywords).includes(
                actualCSSProperty,
              ),
            );

            reportForEntry(
              supportEntryForProperty,
              actualCSSProperty,
              nodeOrLocationObject,
            );

            const supportEntryForPropertyWithAValue =
              findSupportEntryForPropertyAndValue(
                cssSupportEntries,
                actualCSSProperty,
                property.value,
              );

            reportForEntry(
              supportEntryForPropertyWithAValue,
              `${actualCSSProperty}: ${property.value}`,
              nodeOrLocationObject,
            );
          },
        ),
      };
    },
  });
}
