import type { Extensions } from '@tiptap/core';
import { generateJSON } from '@tiptap/html';
import type { Slice } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import { sanitizePastedHtml } from '../utils/paste-sanitizer';

export type PasteHandler = (
  payload: string | File,
  view: EditorView,
) => boolean;

export function createPasteHandler({
  onPaste,
  extensions,
}: {
  onPaste?: PasteHandler;
  extensions: Extensions;
}) {
  return (view: EditorView, event: ClipboardEvent, slice: Slice): boolean => {
    const text = event.clipboardData?.getData('text/plain');

    if (text && onPaste?.(text, view)) {
      event.preventDefault();

      return true;
    }

    if (event.clipboardData?.files?.[0]) {
      const file = event.clipboardData.files[0];
      if (onPaste?.(file, view)) {
        event.preventDefault();

        return true;
      }
    }

    if (slice.content.childCount === 1) {
      return false;
    }

    if (event.clipboardData?.getData?.('text/html')) {
      event.preventDefault();
      const html = event.clipboardData.getData('text/html');

      const sanitizedHtml = sanitizePastedHtml(html);

      const jsonContent = generateJSON(sanitizedHtml, extensions);
      const node = view.state.schema.nodeFromJSON(jsonContent);

      const transaction = view.state.tr.replaceSelectionWith(node, false);
      view.dispatch(transaction);

      return true;
    }
    return false;
  };
}
