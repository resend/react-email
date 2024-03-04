import os from "node:os";
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type {
  EmailClient,
  Platform,
  SupportEntry,
} from "../data/support-response";
import { getNotesOnEntryBySupportString } from "../data/get-notes-on-entry-by-support";
import { getElementNamesForSupportEntry } from "../feature-usage-detection/get-element-names-for-support-entry";
import { fromCaemlToKebabCase } from "../casing/from-camel-to-kebab-case";
import { getPropertyTitlesFromSupportEntry } from "../feature-usage-detection/get-property-titles-from-support-entry";
import { getImageTypeFromTitle } from "../feature-usage-detection/get-image-type-from-title";
import { getElementAttributesFromSupportEntry } from "../feature-usage-detection/get-element-attributes-from-support-entry";
import { findSupportEntryForPropertyAndValue } from "../feature-usage-detection/find-support-entry-for-property-and-value";
import { getCssUnitsFromSupportEntry } from "../feature-usage-detection/get-css-units-from-support-entry";
import { getCssFunctionsFromSupportEntry } from "../feature-usage-detection/get-css-functions-from-support-entry";
import type { SupportEntriesByCategory } from "../data/separate-entries-by-category";
import { listenersForImage } from "./listeners-for-images";
import { listenersForStyleProperty } from "./listeners-for-style-property";

export const listenersForCaniemailSupport = (
  supportEntriesByCategory: SupportEntriesByCategory,
  sourceCode: TSESLint.SourceCode,

  emailClient: EmailClient,
  platform: Platform,

  /**
   * A filtering function that will determien weather or not a support entry should be matched
   * to then call the final reporting callback with.
   *
   * @param supportString - This can be something like "y" (supported), "n" (not supported), "p" (partially supported), "u" (unknown), "m" (mixed).
   * Each of these may contain a reference to a note on the support entry, like "p #1" (partially supported, with reference to note #1).
   */
  predicate: (supportString: string) => boolean,

  report: (metadata: {
    notes?: string;
    feature: string;
    nodeOrLocationObject:
    | TSESTree.Node
    | { location: [start: TSESTree.Position, end: TSESTree.Position] };
  }) => void,
): TSESLint.RuleListener => {
  const handleSupportEntry = (
    entry: SupportEntry | undefined,
    feature: string,
    nodeOrLocationObject:
      | TSESTree.Node
      | {
        location: [start: TSESTree.Position, end: TSESTree.Position];
      },
  ) => {
    if (entry === undefined) return;

    const latestVersionSupportString = Object.values(
      entry.stats[emailClient]?.[platform]?.[0] ?? {},
    )[0] as string | undefined;
    if (latestVersionSupportString === undefined) return;

    if (!predicate(latestVersionSupportString)) return;

    const notesArray =
      getNotesOnEntryBySupportString(latestVersionSupportString, entry) ?? [];

    if (notesArray.length > 0) {
      const notes = notesArray.map((note) => `- ${note}`).join(os.EOL);
      report({
        feature,
        notes,
        nodeOrLocationObject,
      });
    } else {
      report({
        feature,
        nodeOrLocationObject,
      });
    }
  };

  return {
    JSXOpeningElement(node) {
      const elementName = sourceCode.getText(node.name);
      const supportEntryForElementName = supportEntriesByCategory.html.find(
        (e) =>
          getElementNamesForSupportEntry(e.title, e.keywords).includes(
            elementName,
          ),
      );

      handleSupportEntry(supportEntryForElementName, `<${elementName}>`, node);
    },
    JSXAttribute(node) {
      const attributeName = sourceCode.getText(node.name);
      const supportEntryForAttributeName = supportEntriesByCategory.html.find(
        (e) =>
          getElementAttributesFromSupportEntry(e.title).includes(attributeName),
      );

      handleSupportEntry(supportEntryForAttributeName, attributeName, node);
    },
    ...listenersForImage((node, sourceType) => {
      const supportEntryForImage = supportEntriesByCategory.image.find(
        (e) => getImageTypeFromTitle(e.title) === sourceType,
      );
      handleSupportEntry(
        supportEntryForImage,
        supportEntryForImage?.title ?? "",
        node,
      );
    }),
    ...listenersForStyleProperty(
      sourceCode,
      (property, nodeOrLocationObject) => {
        const actualCSSProperty = fromCaemlToKebabCase(property.name);
        const supportEntryForProperty = supportEntriesByCategory.css.find((e) =>
          getPropertyTitlesFromSupportEntry(e.title, e.keywords).includes(
            actualCSSProperty,
          ),
        );

        handleSupportEntry(
          supportEntryForProperty,
          actualCSSProperty,
          nodeOrLocationObject,
        );

        const supportEntryForPropertyWithAValue =
          findSupportEntryForPropertyAndValue(
            supportEntriesByCategory.css,
            actualCSSProperty,
            property.value,
          );

        handleSupportEntry(
          supportEntryForPropertyWithAValue,
          `${actualCSSProperty}: ${property.value}`,
          nodeOrLocationObject,
        );

        const match = property.value.match(/[0-9](?<unit>[a-zA-Z%]+)$/g);
        if (match) {
          const unit = match.groups?.unit;
          if (unit) {
            const supportEntryForUnit = supportEntriesByCategory.css.find(
              (e) => getCssUnitsFromSupportEntry(e.title) === unit,
            );

            if (supportEntryForUnit !== undefined) {
              handleSupportEntry(
                supportEntryForUnit,
                unit,
                nodeOrLocationObject,
              );
            }
          }
        }

        const functionRegex = /(?<functionName>[a-zA-Z_][a-zA-Z0-9_-]*)\s*\(/g;
        let functionName = functionRegex.exec(property.value)?.groups
          ?.functionName;
        while (functionName !== undefined) {
          const supportEntryForFunction = supportEntriesByCategory.css.find(
            // This is fine since the variable for functionName won't change until
            // all the `find` callbacks finish.
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            (e) =>
              getCssFunctionsFromSupportEntry(e.title).includes(functionName!),
          );

          handleSupportEntry(
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
};
