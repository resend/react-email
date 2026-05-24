import type { JSONContent } from '@tiptap/core';
import * as fc from 'fast-check';

/**
 * Generators for `fast-check` property tests.
 *
 * Constrained intentionally to keep shrinking fast on ProseMirror trees:
 *   - shallow nesting (heading/paragraph/list only)
 *   - small text content
 *   - schema-valid by construction (so `fc.pre()` filters are rare)
 */

const safeText = fc
  .string({ minLength: 1, maxLength: 30 })
  .filter((s) => /^[a-zA-Z0-9 .,!?-]+$/.test(s));

const textNode = safeText.map<JSONContent>((text) => ({ type: 'text', text }));

const paragraphNode = fc
  .array(textNode, { minLength: 1, maxLength: 3 })
  .map<JSONContent>((content) => ({ type: 'paragraph', content }));

const headingNode = fc
  .tuple(fc.integer({ min: 1, max: 3 }), safeText)
  .map<JSONContent>(([level, text]) => ({
    type: 'heading',
    attrs: { level },
    content: [{ type: 'text', text }],
  }));

const listItemNode = paragraphNode.map<JSONContent>((p) => ({
  type: 'listItem',
  content: [p],
}));

const bulletListNode = fc
  .array(listItemNode, { minLength: 1, maxLength: 3 })
  .map<JSONContent>((content) => ({ type: 'bulletList', content }));

const blockNode: fc.Arbitrary<JSONContent> = fc.oneof(
  paragraphNode,
  headingNode,
  bulletListNode,
);

/**
 * Arbitrary doc with up to `maxBlocks` top-level block nodes.
 */
export function proseMirrorDocArbitrary(
  options: { maxBlocks?: number } = {},
): fc.Arbitrary<JSONContent> {
  const maxBlocks = options.maxBlocks ?? 5;
  return fc
    .array(blockNode, { minLength: 1, maxLength: maxBlocks })
    .map((content) => ({ type: 'doc', content }));
}
