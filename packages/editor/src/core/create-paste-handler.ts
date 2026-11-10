import type { Extensions } from '@tiptap/core';
import { generateJSON } from '@tiptap/html';
import type { Slice } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import { isFromEditor, sanitizePastedHtml } from '../utils/paste-sanitizer';

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
  // Set while the handler has handed a sanitized paste back to ProseMirror,
  // which calls the handler again for it.
  let pastingSanitized = false;

  return (view: EditorView, event: ClipboardEvent, slice: Slice): boolean => {
    if (pastingSanitized) {
      return false;
    }

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

      // The editor's own copy goes back to ProseMirror once it is sanitized.
      // ProseMirror parses it where the paste lands, where the body container
      // and the theme are not recreated; parsing it below, at the document
      // level, nested one more container per paste. An editor without a
      // container keeps the paste below.
      if (isFromEditor(html) && view.state.schema.nodes.container) {
        pastingSanitized = true;
        try {
          view.pasteHTML(sanitizedHtml, event);
        } finally {
          pastingSanitized = false;
        }
        return true;
      }

      const jsonContent = generateJSON(sanitizedHtml, extensions);
      const node = view.state.schema.nodeFromJSON(jsonContent);

      const transaction = view.state.tr.replaceSelectionWith(node, false);
      view.dispatch(transaction);

      return true;
    }
    return false;
  };
}
