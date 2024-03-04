import { getReportingDataFromNodeOrLocationObject } from "./ast/get-reporting-data-from-node-or-location-object";
import { createRule } from "./create-rule";
import type {
  EmailClient,
  Platform,
} from "./data/support-response";
import type { SupportEntriesByCategory } from "./data/separate-entries-by-category";
import { listenersForCaniemailSupport } from "./ast/listeners-for-caniemail-support";

/**
 * Creates a new eslint rule that is meant to report, as a problem, any occurrence
 * of partially supported features on the given platform along with the appropriate notes
 * written on caniemail.
 */
export function createNoPartiallySupportedOn(
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
        "partially-supported": `'{{feature}}' is only partially supported on ${nicename}.`,
        "partially-supported-with-notes": `'{{feature}}' is only partially supported on ${nicename}.

Notes on its support:
{{notes}}`,
      },
    },
    create(context) {
      return listenersForCaniemailSupport(
        supportEntriesByCategory,
        context.sourceCode,
        emailClient,
        platform,
        (supporString) => supporString.startsWith("a"),
        (metadata) => {
          context.report({
            ...getReportingDataFromNodeOrLocationObject(
              metadata.nodeOrLocationObject,
            ),
            messageId:
              metadata.notes === undefined
                ? "partially-supported"
                : "partially-supported-with-notes",
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
