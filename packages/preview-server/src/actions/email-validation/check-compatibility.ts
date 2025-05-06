'use server';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import {
  convertLocationIntoObject,
  getObjectVariables,
  type SourceLocation,
} from '../../utils/caniemail/ast/get-object-variables';
import type { StylePropertyUsage } from '../../utils/caniemail/ast/get-used-style-properties';
import {
  doesPropertyHaveLocation,
  getUsedStyleProperties,
} from '../../utils/caniemail/ast/get-used-style-properties';
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
import { supportEntries } from './caniemail-data';

export interface CompatibilityCheckingResult {
  location: SourceLocation;
  source: string;
  entry: SupportEntry;
  status: SupportStatus;
  statsPerEmailClient: CompatibilityStats['perEmailClient'];
}

export type EmailClient =
  | 'gmail'
  | 'outlook'
  | 'yahoo'
  | 'apple-mail'
  | 'aol'
  | 'thunderbird'
  | 'microsoft'
  | 'samsung-email'
  | 'sfr'
  | 'orange'
  | 'protonmail'
  | 'hey'
  | 'mail-ru'
  | 'fastmail'
  | 'laposte'
  | 't-online-de'
  | 'free-fr'
  | 'gmx'
  | 'web-de'
  | 'ionos-1and1'
  | 'rainloop'
  | 'wp-pl';

export type Platform =
  | 'desktop-app'
  | 'desktop-webmail'
  | 'mobile-webmail'
  | 'webmail'
  | 'ios'
  | 'android'
  | 'windows'
  | 'macos'
  | 'windows-mail'
  | 'outlook-com';

export type SupportEntryCategroy = 'html' | 'css' | 'image' | 'others';

export interface SupportEntry {
  slug: string;
  title: string;
  description: string | null;
  url: string;
  category: SupportEntryCategroy;
  tags: string[];
  keywords: string | null;
  last_test_date: string;
  test_url: string;
  test_results_url: string | null;
  stats: Partial<
    Record<
      EmailClient,
      Partial<
        Record<
          Platform,
          /*
            This last Record<string, string> has only one key, as the
            ordered version of caniemail's data is meant to be something like:
           
            [
              { "1.0": "u" },
              { "2.0": "y" },
              { "3.0": "p #1" },
            ]
           
            So only one key for each object inside of this array, TypeScript can't really
            describe this though AFAIK.
          */
          Record</* version */ string, string>[]
        >
      >
    >
  >;
  notes: string | null;
  notes_by_num: Record<number, string> | null;
}

const relevantEmailClients: EmailClient[] = [
  'gmail',
  'apple-mail',
  'outlook',
  'yahoo',
];

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

  const objectVariables = getObjectVariables(ast);
  const usedStyleProperties = await getUsedStyleProperties(
    ast,
    reactCode,
    emailPath,
    objectVariables,
  );
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
                snakeToCamel(property.name) ===
                  snakeToCamel(entryFullProperty!.name) &&
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
            } else if (
              entryProperties.some(
                (propertyName) =>
                  snakeToCamel(property.name) === snakeToCamel(propertyName),
              )
            ) {
              addToInsights(property);
              break;
            }
          }
        }
      }
      controller.close();
    },
  });

  return readableStream;
};

const snakeToCamel = (snakeStr: string) => {
  return snakeStr
    .toLowerCase()
    .replace(/-+([a-z])/g, (_match, letter) => letter.toUpperCase());
};

export type AST = ReturnType<typeof parse>;
