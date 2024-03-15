import { getReportingDataFromNodeOrLocationObject } from "./ast/get-reporting-data-from-node-or-location-object";
import { createRule } from "./create-rule";
import type { SupportEntriesByCategory } from "./data/separate-entries-by-category";
import type { EmailClient, Platform } from "./data/support-response";
import { listenersForCaniemailSupport } from "./ast/listeners-for-caniemail-support";

/**
 * Creates a new eslint rule that is meant to report, as a problem, any occurrence
 * of unsupported features on the given platform.
 */
export function createNoUnsupportedOn(
  supportEntriesByCategory: SupportEntriesByCategory,
  nicename: string,
  emailClient: EmailClient,
  platform: Platform,
) {
  return createRule({
    meta: {
      type: "problem",
      schema: [],
      messages: {
        unsupported: `'{{feature}}' is not supported on ${nicename}.`,
        "unsupported-with-notes": `'{{feature}}' is not supported on ${nicename}.

Notes on its support:
{{notes}}`,
      },
    },
    create(context) {
      return listenersForCaniemailSupport(
        supportEntriesByCategory,
        context.sourceCode,
        context.filename,
        emailClient,
        platform,
        (supporString) => supporString.startsWith("n"),
        (metadata) => {
          context.report({
            ...getReportingDataFromNodeOrLocationObject(
              metadata.nodeOrLocationObject,
            ),
            messageId:
              metadata.notes === undefined
                ? "unsupported"
                : "unsupported-with-notes",
            data: {
              feature: metadata.feature,
              notes: metadata.notes,
            },
          });
        },
      );
    },
  });
}
