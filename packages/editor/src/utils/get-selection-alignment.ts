import type { Editor } from '@tiptap/core';

/**
 * Resolves the effective text alignment for the current selection.
 *
 * The `alignment` attribute is left `null` when no explicit alignment is set so
 * that natural inheritance can work. This helper walks up the ancestor chain and
 * returns the nearest explicit alignment (on the textblock itself or an aligned
 * ancestor such as a table cell), falling back to `left` only when nothing sets
 * one. Without this, a paragraph inside a center-aligned cell would report
 * `left` while visually inheriting `center`.
 */
export function getSelectionAlignment(editor: Editor): string {
  const { $from } = editor.state.selection;

  for (let depth = $from.depth; depth >= 0; depth -= 1) {
    const node = $from.node(depth);
    const alignment = node.attrs?.alignment ?? node.attrs?.align;
    if (alignment) {
      return alignment;
    }
  }

  return 'left';
}
