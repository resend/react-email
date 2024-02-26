import os from "node:os";
import type { TSESTree } from "@typescript-eslint/utils";
import { getReportingDataFromNodeOrLocationObject } from "./ast/get-reporting-data-from-node-or-location-object";
import { fromCaemlToKebabCase } from "./casing/from-camel-to-kebab-case";
import { createRule } from "./create-rule";
import { getPropertyTitlesFromSupportEntry } from "./data/get-property-titles-from-support-entry";
import type { SupportEntry } from "./data/support-response";
import { listenersForStyleProperty } from "./feature-usage/listeners-for-style-property";
import { findSupportEntryForPropertyAndValue } from "./data/find-support-entry-for-property-and-value";
import { getNotesOnEntryBySupportValue } from "./data/get-notes-on-entry-by-support";
import { getElementNamesForSupportEntry } from "./data/get-element-names-for-support-entry";

type SupportEntryWithVersionsInArray = SupportEntry & {
  supportPerVersion: { version: string; support: string }[];
};

/**
 * Creates a new eslint rule that is meant to report, as a problem, any occurrence
 * of partially supported features on the given platform along with the appropriate notes
 * written on caniemail.
 */
export function createNoPartiallySupportedOn(
  supportEntries: SupportEntryWithVersionsInArray[],
  platform: string,
) {
  const cssSupportEntries = supportEntries.filter(
    (entry) => entry.category === "css",
  );
  const htmlSupportEntries = supportEntries.filter(
    (entry) => entry.category === "html",
  );
  return createRule({
    meta: {
      type: "problem",
      schema: [],
      messages: {
        "partially-supported": `'{{feature}}' is only partially supported on ${platform} (versions {{versionsSeparatedByComma}}).

Notes on its support:
{{notes}}`,
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
            .filter((meta) => meta.support.startsWith("a"))
            .map((meta) => ({
              version: meta.version,
              notes: getNotesOnEntryBySupportValue(meta.support, entry),
            }));

          if (unsupportedVersions.length > 0) {
            context.report({
              ...getReportingDataFromNodeOrLocationObject(nodeOrLocationObject),
              messageId: "partially-supported",
              data: {
                feature,
                versionsSeparatedByComma: unsupportedVersions
                  .map((data) => data.version)
                  .join(", "),
                /*
                Example of how the notes end up looking: 
                
                - 1.0.0:
                  * This is a note.
                  * This is another note.
                  * This is a third note.
                - 2.0.0:
                  * This is a note.
                */
                notes: unsupportedVersions
                  .filter((data) => data.notes)
                  .map(
                    (data) =>
                      `- ${data.version}: ${data
                        .notes!.map((note) => `${os.EOL}  * ${note}`)
                        .join("")}`,
                  )
                  .join(os.EOL),
              },
            });
          }
        }
      };

      return {
        JSXOpeningElement(node) {
          const elementName = context.sourceCode.getText(node.name);
          const supportEntryForElementName = htmlSupportEntries.find((e) =>
            getElementNamesForSupportEntry(e.title, e.keywords).includes(
              elementName,
            ),
          );

          reportForEntry(supportEntryForElementName, `<${elementName}>`, node);
        },
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
