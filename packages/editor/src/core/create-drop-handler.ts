import type { Extensions } from '@tiptap/core';
import { generateJSON } from '@tiptap/html';
import type { EditorView } from '@tiptap/pm/view';
import { sanitizePastedHtml } from '../utils/paste-sanitizer';
import type { PasteHandler } from './create-paste-handler';

interface CreateDropHandlerOptions {
  onPaste?: PasteHandler;
  /**
   * Editor extensions; required to convert dropped HTML/text into
   * ProseMirror JSON via `generateJSON`. When omitted, only file drops
   * (the legacy behavior) are handled.
   */
  extensions?: Extensions;
}

export function createDropHandler({
  onPaste,
  extensions,
}: CreateDropHandlerOptions) {
  return (
    view: EditorView,
    event: DragEvent,
    _slice: unknown,
    moved: boolean,
  ): boolean => {
    // Internal block reorders: let ProseMirror handle them.
    if (moved) return false;

    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) return false;

    if (dataTransfer.files && dataTransfer.files[0]) {
      event.preventDefault();
      const file = dataTransfer.files[0];

      if (onPaste?.(file, view)) {
        return true;
      }
    }

    if (extensions === undefined) {
      return false;
    }

    const html = dataTransfer.getData('text/html');
    const text = dataTransfer.getData('text/plain');

    if (!html && !text) return false;

    event.preventDefault();
    const source = html || `<p>${escapeHtml(text)}</p>`;
    const sanitized = sanitizePastedHtml(source);
    const json = generateJSON(sanitized, extensions);
    const node = view.state.schema.nodeFromJSON(json);
    view.dispatch(view.state.tr.replaceSelectionWith(node, false));
    return true;
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
