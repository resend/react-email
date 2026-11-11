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
      // data-pm-slice marks the open container wrapper of a copy made inside
      // the body, which only ProseMirror's own paste can merge. It is dropped
      // before the sanitizer runs, so the sanitizer sees what gets parsed.
      const html = event.clipboardData
        .getData('text/html')
        .replace(/(<[a-z][^>]*) data-pm-slice="[^"]*"/i, '$1');

      const sanitizedHtml = sanitizePastedHtml(html);

      // Parsed where the paste lands, not at the document level, so the
      // container and the theme of a whole-document copy are not recreated
      // inside the body.
      const jsonContent = generateJSON(sanitizedHtml, extensions, {
        context: view.state.selection.$from,
      });
      const node = view.state.schema.nodeFromJSON(jsonContent);

      const transaction = view.state.tr.replaceSelectionWith(node, false);
      view.dispatch(transaction);

      return true;
    }
    return false;
  };
}
