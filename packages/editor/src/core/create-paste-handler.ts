import type { Extensions } from '@tiptap/core';
import { generateJSON } from '@tiptap/html';
import type { Slice } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import { sanitizePastedHtml } from '../utils/paste-sanitizer';

export type PasteHandler = (
  payload: string | File,
  view: EditorView,
) => boolean;

export type UploadImageHandler = (
  file: File,
  view: EditorView,
  pos: number,
  preserveAttributes?: {
    width?: string;
    height?: string;
    alignment?: string;
    href?: string;
  },
) => void | Promise<void>;

export function createPasteHandler({
  onPaste,
  onUploadImage,
  extensions,
}: {
  onPaste?: PasteHandler;
  onUploadImage?: UploadImageHandler;
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

      if (file.type.includes('image/') && onUploadImage) {
        const pos = view.state.selection.from;
        void onUploadImage(file, view, pos);

        return true;
      }
    }

    /**
     * If the coming content has a single child, we can assume
     * it's a plain text and doesn't need to be parsed and
     * be introduced in a new line
     */
    if (slice.content.childCount === 1) {
      return false;
    }

    if (event.clipboardData?.getData?.('text/html')) {
      event.preventDefault();
      const html = event.clipboardData.getData('text/html');

      // Strip visual styles, keep semantic formatting (bold, italic, links, etc.)
      const sanitizedHtml = sanitizePastedHtml(html);

      const jsonContent = generateJSON(sanitizedHtml, extensions);
      const node = view.state.schema.nodeFromJSON(jsonContent);

      // Insert the parsed content into the editor at the current selection
      const transaction = view.state.tr.replaceSelectionWith(node, false);
      view.dispatch(transaction);

      return true;
    }
    return false;
  };
}
