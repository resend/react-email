import type { Editor } from '@tiptap/core';

/**
 * Resolves the effective text alignment for the current selection.
 *
 * The `alignment` attribute is left `null` when no explicit alignment is set so
 * that natural (left) inheritance can work. This helper treats that `null` as
 * `left` so callers can compare against the resolved value.
 */
export function getSelectionAlignment(editor: Editor): string {
  const { $from } = editor.state.selection;
  const parent = $from.parent;

  if (!parent.isTextblock) {
    return 'left';
  }

  return parent.attrs.alignment ?? 'left';
}
