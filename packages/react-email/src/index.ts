import { supportEntries } from './caniemail/data.js';
import {
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
  for (const entry of elementsEntries) {
    if (entry.names.includes(element.toLowerCase())) {
      return parseCompatibilityStats(entry.original, emailClients);
    }
  }
}

// const attributeEntries = parsedEntries.filter(
//   (e) => e.type === 'element-attributes',
// );
//
// export function checkSupportForAttribute(
//   attribute: string,
//   emailClients: EmailClient[],
// ) {
//   for (const entry of attributeEntries) {
//     if (entry.attributes.includes(attribute.toLowerCase())) {
//       return parseCompatibilityStats(entry.original, emailClients);
//     }
//   }
// }
//
// const attributeEntries = parsedEntries.filter(
//   (e) =>
//     e.type === 'css-functions' ||
//     e.type === 'css-property-names' ||
//     e.type === 'css-property-with-value' ||
//     e.type === 'css-unit',
// );
//
// export function checkSupportForStyleDeclaration(
//   name: string,
//   value: string,
// ) {
//   for (const entry of attributeEntries) {
//   }
// }
