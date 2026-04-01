import type { Node } from '@tiptap/pm/model';

export function isDocumentVisuallyEmpty(doc: Node): boolean {
  return !doc.textContent; // either null, undefined or an empty string
}
