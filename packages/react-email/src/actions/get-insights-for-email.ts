'use server';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import type { EmailClient, SupportEntry } from '../components/email-insights';
import { supportEntries } from '../app/caniemail-data';
import { getCssPropertyNames } from '../utils/caniemail/get-css-property-names';
import type {
  InsightStatsPerPlatform,
  InsightStatus,
} from '../utils/caniemail/get-insights-stats-for-entry';
import { getInsightsStatsForEntry } from '../utils/caniemail/get-insights-stats-for-entry';
import { getCssUnit } from '../utils/caniemail/get-css-unit';
import { getCssFunctions } from '../utils/caniemail/get-css-functions';
import { getCssPropertyWithValue } from '../utils/caniemail/get-css-property-with-value';
import { getElementNames } from '../utils/caniemail/get-element-names';
import { getElementAttributes } from '../utils/caniemail/get-element-attributes';
import {
  convertLocationIntoObject,
  getObjectVariables,
  type SourceLocation,
} from '../utils/caniemail/ast/get-object-variables';
import type { StylePropertyUsage } from '../utils/caniemail/ast/get-used-style-properties';
import {
  doesPropertyHaveLocation,
  getUsedStyleProperties,
} from '../utils/caniemail/ast/get-used-style-properties';

export interface Insight {
  location: SourceLocation;
  source: string;
  entry: SupportEntry;
  worseStatus: InsightStatus;
  stats: InsightStatsPerPlatform;
}

export const getInsightsForEmail = async (
  reactCode: string,
  emailClient: EmailClient,
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const ast = parse(reactCode, {
    strictMode: false,
    errorRecovery: true,
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript', 'decorators'],
  });

  const insights: Insight[] = [];

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
  const usedStyleProperties = getUsedStyleProperties(ast, objectVariables);
  for (const entry of supportEntries) {
    const stats = getInsightsStatsForEntry(entry, emailClient);
    if (!stats) continue;
    if (stats.worseStatus === 'working') continue;

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
              if (entryElements.includes(elementName) && path.node.name.loc) {
                addedInsight = true;
                insights.push({
                  entry,
                  source: getSourceCodeAt(path.node.name.loc),
                  location: convertLocationIntoObject(path.node.name.loc),
                  ...stats,
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
                insights.push({
                  entry,
                  source: getSourceCodeAt(path.node.name.loc),
                  location: convertLocationIntoObject(path.node.name.loc),
                  ...stats,
                });
              }
            }
          },
        });
      }
    }

    if (entry.category === 'css') {
      const entryFullProperty = getCssPropertyWithValue(entry.title);
      const entryProperties = getCssPropertyNames(entry.title, entry.keywords);
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
        insights.push({
          entry,
          location: convertLocationIntoObject(property.location),
          source: getSourceCodeAt(property.location),
          ...stats,
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
                emailClient,
                reactCode,
                ast,
              },
            },
          );
        }

        if (cssEntryType === 'full property') {
          if (
            property.name === entryFullProperty?.name &&
            property.value === entryFullProperty.value
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
          entryProperties.some((propertyName) => property.name === propertyName)
        ) {
          addToInsights(property);
          break;
        }
      }
    }
  }
  return insights;
};

export type AST = ReturnType<typeof parse>;
