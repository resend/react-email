import type { Extensions } from "@tiptap/core";

const COLLABORATION_EXTENSION_NAMES = new Set([
  'liveblocksExtension',
  'collaboration',
]);

export function hasCollaborationExtension(exts: Extensions): boolean {
  return exts.some((ext) => COLLABORATION_EXTENSION_NAMES.has(ext.name));
}

