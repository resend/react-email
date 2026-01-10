'use server';

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { compatibilityEmailClients } from '../../app/env';
import type {
  SourceLocation,
  StylePropertyUsage,
} from '../../utils/caniemail/ast/get-used-style-properties';
import {
  convertLocationIntoObject,
  doesPropertyHaveLocation,
  getUsedStyleProperties,
} from '../../utils/caniemail/ast/get-used-style-properties';
import {
  allEmailClients,
  type EmailClient,
  type SupportEntry,
} from '../../utils/caniemail/email-clients';
import type {
  CompatibilityStats,
  SupportStatus,
} from '../../utils/caniemail/get-compatibility-stats-for-entry';
import { getCompatibilityStatsForEntry } from '../../utils/caniemail/get-compatibility-stats-for-entry';
import { getCssFunctions } from '../../utils/caniemail/get-css-functions';
import { getCssPropertyNames } from '../../utils/caniemail/get-css-property-names';
import { getCssPropertyWithValue } from '../../utils/caniemail/get-css-property-with-value';
import { getCssUnit } from '../../utils/caniemail/get-css-unit';
import { getElementAttributes } from '../../utils/caniemail/get-element-attributes';
import { getElementNames } from '../../utils/caniemail/get-element-names';
import { snakeToCamel } from '../../utils/snake-to-camel';
import { supportEntries } from './caniemail-data';

export interface CompatibilityCheckingResult {
  location: SourceLocation;
  source: string;
  entry: SupportEntry;
  status: SupportStatus;
  statsPerEmailClient: CompatibilityStats['perEmailClient'];
}

// Types are now exported from '../../utils/caniemail/email-clients'

const defaultEmailClients: EmailClient[] = [
  'gmail',
  'apple-mail',
  'outlook',
  'yahoo',
];

/**
 * Get the list of email clients to check compatibility for.
 * Uses COMPATIBILITY_EMAIL_CLIENTS env var if set, otherwise defaults to
 * ['gmail', 'apple-mail', 'outlook', 'yahoo'].
 */
const getRelevantEmailClients = (): EmailClient[] => {
  if (!compatibilityEmailClients) {
    return defaultEmailClients;
  }

  const clients = compatibilityEmailClients
    .split(',')
    .map((client) => client.trim().toLowerCase())
    .filter((client): client is EmailClient =>
      (allEmailClients as readonly string[]).includes(client),
    );

  return clients.length > 0 ? clients : defaultEmailClients;
};

export const checkCompatibility = async (
  reactCode: string,
  emailPath: string,
) => {
  const ast = parse(reactCode, {
    strictMode: false,
    errorRecovery: true,
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript', 'decorators'],
  });

  const getSourceCodeAt = (location: SourceLocation) => {
    const codeLines = reactCode.split(/\n|\r|\r\n/);
    const source = codeLines
      .slice(
        Math.max(location.start.line - 2, 0),
        Math.min(location.end.line + 2, codeLines.length),
      )
      .join('\n');
    return source;
  };

  const usedStyleProperties = await getUsedStyleProperties(
    ast,
    reactCode,
    emailPath,
  );
  const relevantEmailClients = getRelevantEmailClients();
  const readableStream = new ReadableStream<CompatibilityCheckingResult>({
    async start(controller) {
      for (const entry of supportEntries) {
        const compatibilityStats = getCompatibilityStatsForEntry(
          entry,
          relevantEmailClients,
        );
        if (Object.keys(compatibilityStats.perEmailClient).length === 0)
          continue;
        if (
          compatibilityStats.status === 'success' ||
          compatibilityStats.status === 'warning'
        )
          continue;

        if (entry.category === 'html') {
          const entryElements = getElementNames(entry.title, entry.keywords);
          const entryAttributes = getElementAttributes(entry.title);
          const htmlEntryType = (() => {
            if (entryElements.length > 0) {
              return 'element';
            }

            if (entryAttributes.length > 0) {
              return 'attribute';
            }
          })();

          if (!htmlEntryType) continue;

          let addedInsight = false;
          if (htmlEntryType === 'element') {
            traverse(ast, {
              JSXOpeningElement(path) {
                if (path.node.name.type === 'JSXIdentifier' && !addedInsight) {
                  const elementName = path.node.name.name;
                  if (
                    entryElements.includes(elementName) &&
                    path.node.name.loc
                  ) {
                    addedInsight = true;
                    controller.enqueue({
                      entry,
                      source: getSourceCodeAt(path.node.name.loc),
                      location: convertLocationIntoObject(path.node.name.loc),
                      statsPerEmailClient: compatibilityStats.perEmailClient,
                      status: compatibilityStats.status,
                    });
                  }
                }
              },
            });
          } else {
            traverse(ast, {
              JSXAttribute(path) {
                if (path.node.name.type === 'JSXIdentifier' && !addedInsight) {
                  const attributeName = path.node.name.name;
                  if (
                    entryAttributes.includes(attributeName) &&
                    path.node.name.loc
                  ) {
                    addedInsight = true;
                    controller.enqueue({
                      entry,
                      source: getSourceCodeAt(path.node.name.loc),
                      location: convertLocationIntoObject(path.node.name.loc),
                      statsPerEmailClient: compatibilityStats.perEmailClient,
                      status: compatibilityStats.status,
                    });
                  }
                }
              },
            });
          }
        }

        if (entry.category === 'css') {
          const entryFullProperty = getCssPropertyWithValue(entry.title);
          const entryProperties = getCssPropertyNames(
            entry.title,
            entry.keywords,
          );
          const entryUnit = getCssUnit(entry.title);
          const entryFunctions = getCssFunctions(entry.title);

          const cssEntryType = (() => {
            if (entryFullProperty?.name && entryFullProperty.value) {
              return 'full property';
            }

            if (entryFunctions.length > 0) {
              return 'function';
            }

            if (entryUnit) {
              return 'unit';
            }

            if (entryProperties.length > 0) {
              return 'property name';
            }
          })();

          if (!cssEntryType) continue;
          const addToInsights = (
            property: StylePropertyUsage & { location: SourceLocation },
          ) => {
            controller.enqueue({
              entry,
              location: convertLocationIntoObject(property.location),
              source: getSourceCodeAt(property.location),
              statsPerEmailClient: compatibilityStats.perEmailClient,
              status: compatibilityStats.status,
            });
          };

          for (const property of usedStyleProperties) {
            if (!doesPropertyHaveLocation(property)) {
              throw new Error(
                "One of the properties' node did not contain the proper location for it on the source code. This must be an issue because we always need access to the source.",
                {
                  cause: {
                    property,
                    entry,
                    reactCode,
                    ast,
                  },
                },
              );
            }

            if (cssEntryType === 'full property') {
              if (
                property.name === snakeToCamel(entryFullProperty!.name) &&
                property.value === entryFullProperty!.value
              ) {
                addToInsights(property);
                break;
              }
            } else if (cssEntryType === 'function') {
              const functionRegex =
                /(?<functionName>[a-zA-Z_][a-zA-Z0-9_-]*)\s*\(/g;
              const functionName = functionRegex.exec(property.value)?.groups
                ?.functionName;
              if (functionName !== undefined) {
                if (entryFunctions.includes(functionName)) {
                  addToInsights(property);
                  break;
                }
              }
            } else if (cssEntryType === 'unit') {
              const match = property.value.match(/[0-9](?<unit>[a-zA-Z%]+)$/g);
              if (match) {
                const unit = match.groups?.unit;
                if (entryUnit && unit && entryUnit === unit) {
                  addToInsights(property);
                  break;
                }
              }
            } else if (cssEntryType === 'property name') {
              if (
                entryProperties.some(
                  (propertyName) =>
                    snakeToCamel(propertyName) === property.name,
                )
              ) {
                addToInsights(property);
                break;
              }
            }
          }
        }
      }
      controller.close();
    },
  });

  return readableStream;
};

export type AST = ReturnType<typeof parse>;
