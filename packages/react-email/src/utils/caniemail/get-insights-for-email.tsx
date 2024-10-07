import { Style } from 'node:util';
import { parse } from '@babel/parser';
import type { Node } from '@babel/traverse';
import traverse from '@babel/traverse';
import type {
  EmailClient,
  SupportEntry,
} from '../../components/email-insights';
import { supportEntries } from '../../app/caniemail-data';
import { getCssPropertyNames } from './get-css-property-names';
import type {
  InsightStatsPerPlatform,
  InsightStatus,
} from './get-insights-stats-for-entry';
import { getInsightsStatsForEntry } from './get-insights-stats-for-entry';
import { getCssUnit } from './get-css-unit';
import { getCssFunctions } from './get-css-functions';
import { getCssPropertyWithValue } from './get-css-property-with-value';

export interface Insight {
  location: SourceLocation;
  source: string;
  entry: SupportEntry;
  worseStatus: InsightStatus;
  stats: InsightStatsPerPlatform;
}

export const getInsightsForEmail = (
  reactCode: string,
  emailClient: EmailClient,
) => {
  const ast = parse(reactCode, {
    strictMode: false,
    errorRecovery: true,
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript', 'decorators'],
  });

  const insights: Insight[] = [];

  const objectVariables = getObjectVariables(ast);
  const usedStyleProperties = getUsedStyleProperties(ast, objectVariables);
  for (const entry of supportEntries) {
    const stats = getInsightsStatsForEntry(entry, emailClient);
    if (!stats) continue;
    if (stats.worseStatus === 'working') continue;

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
        const codeLines = reactCode.split(/\n|\r|\r\n/);
        const source = codeLines
          .slice(
            Math.max(property.location.start.line - 2, 0),
            Math.min(property.location.end.line + 2, codeLines.length),
          )
          .join('\n');
        insights.push({
          entry,
          location: property.location,
          source,
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

type AST = ReturnType<typeof parse>;

interface Position {
  line: number;
  column: number;
  index: number;
}
interface SourceLocation {
  start: Position;
  end: Position;
  filename: string;
  identifierName: string | undefined | null;
}

interface StylePropertyUsage {
  location: SourceLocation | undefined | null;
  name: string;
  value: string;
}

type ObjectProperty = Node & { type: 'ObjectProperty' };

type ObjectVariables = Record<string, ObjectProperty[]>;

const getObjectVariables = (ast: AST) => {
  const objectVariables: ObjectVariables = {};
  traverse(ast, {
    ObjectExpression(nodePath) {
      if (nodePath.parent.type === 'VariableDeclarator') {
        if (nodePath.parent.id.type === 'Identifier') {
          const variableName = nodePath.parent.id.name;
          const properties: ObjectProperty[] = [];
          for (const property of nodePath.node.properties) {
            if (property.type === 'ObjectProperty') {
              properties.push(property);
            }
          }
          objectVariables[variableName] = properties;
        }
      }
    },
  });

  return objectVariables;
};

export const doesPropertyHaveLocation = (
  prop: StylePropertyUsage,
): prop is StylePropertyUsage & { location: SourceLocation } => {
  return prop.location !== undefined && prop.location !== null;
};

const getUsedStyleProperties = (ast: AST, objectVariables: ObjectVariables) => {
  const styleProperties: StylePropertyUsage[] = [];
  traverse(ast, {
    Identifier(nodePath) {
      if (
        nodePath.parent.type === 'JSXExpressionContainer' &&
        nodePath.parentPath.parent.type === 'JSXAttribute' &&
        nodePath.parentPath.parent.name.name === 'style'
      ) {
        const styleVariable = objectVariables[nodePath.node.name];
        if (styleVariable) {
          for (const property of styleVariable) {
            if (
              (property.key.type === 'StringLiteral' ||
                property.key.type === 'Identifier') &&
              property.value.type === 'StringLiteral'
            ) {
              const propertyName =
                property.key.type === 'StringLiteral'
                  ? property.key.value
                  : property.key.name;
              styleProperties.push({
                name: propertyName,
                value: property.value.value,
                location: property.loc,
              });
            }
          }
        }
      }
    },
  });

  return styleProperties;
};
