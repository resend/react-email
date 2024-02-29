import os from "node:os";
import type { TSESTree } from "@typescript-eslint/utils";
import { getReportingDataFromNodeOrLocationObject } from "./ast/get-reporting-data-from-node-or-location-object";
import { fromCaemlToKebabCase } from "./casing/from-camel-to-kebab-case";
import { createRule } from "./create-rule";
import { getPropertyTitlesFromSupportEntry } from "./feature-usage-detection/get-property-titles-from-support-entry";
import type { SupportEntry } from "./data/support-response";
import { listenersForStyleProperty } from "./ast/listeners-for-style-property";
import { findSupportEntryForPropertyAndValue } from "./feature-usage-detection/find-support-entry-for-property-and-value";
import { getElementNamesForSupportEntry } from "./feature-usage-detection/get-element-names-for-support-entry";
import { getNotesOnEntryBySupportValue } from "./data/get-notes-on-entry-by-support";
import { getElementAttributesFromSupportEntry } from "./feature-usage-detection/get-element-attributes-from-support-entry";
import { listenersForImage } from "./ast/listeners-for-images";
import { getImageTypeFromTitle } from "./feature-usage-detection/get-image-type-from-title";
import { getCssFunctionsFromSupportEntry } from "./feature-usage-detection/get-css-functions-from-support-entry";
import { getCssUnitsFromSupportEntry } from "./feature-usage-detection/get-css-units-from-support-entry";

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
  const imageSupportEntries = supportEntries.filter(
    (entry) => entry.category === "image",
  );
  return createRule({
    meta: {
      type: "problem",
      schema: [],
      messages: {
        "partially-supported": `'{{feature}}' is only partially supported on ${platform} (versions {{versionsSeparatedByComma}}).`,
        "partially-supported-with-notes": `'{{feature}}' is only partially supported on ${platform} (versions {{versionsSeparatedByComma}}).

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
          const partiallySupportedVersions = entry.supportPerVersion
            .filter((meta) => meta.support.startsWith("a"))
            .map((meta) => ({
              version: meta.version,
              notes: getNotesOnEntryBySupportValue(meta.support, entry),
            }));

          if (partiallySupportedVersions.length > 0) {
            /*
            Example of how the notes end up looking: 
            
            - 1.0.0:
              * This is a note.
              * This is another note.
              * This is a third note.
            - 2.0.0:
              * This is a note.
            */
            const notes = partiallySupportedVersions
              .filter((data) => data.notes)
              .map((data) => {
                const notesOnVersion = data
                  .notes!.map((note) => `  * ${note}`)
                  .join(os.EOL);

                return `- ${data.version}: ${os.EOL}${notesOnVersion}`;
              })
              .join(os.EOL);

            if (notes.trim().length > 0) {
              context.report({
                ...getReportingDataFromNodeOrLocationObject(
                  nodeOrLocationObject,
                ),
                messageId: "partially-supported-with-notes",
                data: {
                  feature,
                  versionsSeparatedByComma: partiallySupportedVersions
                    .map((data) => data.version)
                    .join(", "),
                  notes,
                },
              });
            } else {
              context.report({
                ...getReportingDataFromNodeOrLocationObject(
                  nodeOrLocationObject,
                ),
                messageId: "partially-supported",
                data: {
                  feature,
                  versionsSeparatedByComma: partiallySupportedVersions
                    .map((data) => data.version)
                    .join(", "),
                },
              });
            }
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
        JSXAttribute(node) {
          const attributeName = context.sourceCode.getText(node.name);
          const supportEntryForAttributeName = htmlSupportEntries.find((e) =>
            getElementAttributesFromSupportEntry(e.title).includes(
              attributeName,
            ),
          );

          reportForEntry(supportEntryForAttributeName, attributeName, node);
        },
        ...listenersForImage((node, sourceType) => {
          const supportEntryForImage = imageSupportEntries.find(
            (e) => getImageTypeFromTitle(e.title) === sourceType,
          );
          reportForEntry(
            supportEntryForImage,
            supportEntryForImage?.title ?? "",
            node,
          );
        }),
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

            const match = property.value.match(/[0-9](?<unit>[a-zA-Z%]+)$/g);
            if (match) {
              const unit = match.groups?.unit;
              if (unit) {
                const supportEntryForUnit = cssSupportEntries.find(
                  (e) => getCssUnitsFromSupportEntry(e.title) === unit,
                );

                if (supportEntryForUnit !== undefined) {
                  reportForEntry(
                    supportEntryForUnit,
                    unit,
                    nodeOrLocationObject,
                  );
                }
              }
            }

            const functionRegex =
              /(?<functionName>[a-zA-Z_][a-zA-Z0-9_-]*)\s*\(/g;
            let functionName = functionRegex.exec(property.value)?.groups
              ?.functionName;
            while (functionName !== undefined) {
              // This is fine since the variable for functionName won't change until
              // all the `find` callbacks finish.
              // eslint-disable-next-line @typescript-eslint/no-loop-func
              const supportEntryForFunction = cssSupportEntries.find((e) =>
                getCssFunctionsFromSupportEntry(e.title).includes(
                  functionName!,
                ),
              );

              reportForEntry(
                supportEntryForFunction,
                `${functionName}()`,
                nodeOrLocationObject,
              );

              functionName = functionRegex.exec(property.value)?.groups
                ?.functionName;
            }
          },
        ),
      };
    },
  });
}
