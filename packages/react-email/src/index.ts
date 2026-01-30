import { supportEntries } from './caniemail/data.js';
import {
  type CompatibilityStats,
  type EmailClient,
  type ParsedSupportEntry,
  parseCompatibilityStats,
  parseSupportEntry,
} from './caniemail/support-entry-parsing.js';

const parsedEntries = supportEntries
  .map(parseSupportEntry)
  .filter((e): e is ParsedSupportEntry => e !== undefined);

const elementsEntries = parsedEntries.filter((e) => e.type === 'elements');

export function checkSupportForElement(
  element: string,
  emailClients: EmailClient[],
) {
  let aggregatedStats: CompatibilityStats[] = [];
  for (const entry of elementsEntries) {
    if (entry.names.includes(element.toLowerCase())) {
      const stats = parseCompatibilityStats(entry.original, emailClients);

      aggregatedStats = [...aggregatedStats, ...stats];
    }
  }
  return aggregatedStats;
}

const attributeEntries = parsedEntries.filter(
  (e) => e.type === 'element-attributes',
);

export function checkSupportForAttribute(
  attribute: string,
  emailClients: EmailClient[],
) {
  let aggregatedStats: CompatibilityStats[] = [];
  for (const entry of attributeEntries) {
    if (entry.attributes.includes(attribute.toLowerCase())) {
      const stats = parseCompatibilityStats(entry.original, emailClients);

      aggregatedStats = [...aggregatedStats, ...stats];
    }
  }
  return aggregatedStats;
}

const cssEntries = parsedEntries.filter(
  (e) =>
    e.type === 'css-functions' ||
    e.type === 'css-property-names' ||
    e.type === 'css-property-with-value' ||
    e.type === 'css-unit',
);

export function checkSupportForStyleDeclaration(
  name: string,
  value: string,
  emailClients: EmailClient[],
) {
  let aggregatedStats: CompatibilityStats[] = [];
  for (const entry of cssEntries) {
    if (entry.type === 'css-property-with-value') {
      if (
        entry.name.trim() === name.toLowerCase().trim() &&
        entry.value.trim() === value.toLowerCase().trim()
      ) {
        const stats = parseCompatibilityStats(entry.original, emailClients);

        aggregatedStats = [...aggregatedStats, ...stats];
      }
    } else if (entry.type === 'css-property-names') {
      if (entry.propertyNames.includes(name.toLowerCase())) {
        const stats = parseCompatibilityStats(entry.original, emailClients);

        aggregatedStats = [...aggregatedStats, ...stats];
      }
    } else if (entry.type === 'css-functions') {
      const functionRegex = /(?<functionName>[a-zA-Z_][a-zA-Z0-9_-]*)\s*\(/g;
      const functionName = functionRegex.exec(value)?.groups?.functionName;
      if (functionName !== undefined) {
        if (entry.functions.includes(functionName)) {
          const stats = parseCompatibilityStats(entry.original, emailClients);

          aggregatedStats = [...aggregatedStats, ...stats];
        }
      }
    } else if (entry.type === 'css-unit') {
      const match = value.match(/[0-9](?<unit>[a-zA-Z%]+)$/g);
      if (match) {
        const unit = match.groups?.unit;
        if (entry.unit === unit) {
          const stats = parseCompatibilityStats(entry.original, emailClients);

          aggregatedStats = [...aggregatedStats, ...stats];
        }
      }
    }
  }
  return aggregatedStats;
}
