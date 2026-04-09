import type { Extensions } from '@tiptap/core';
import { generateJSON } from '@tiptap/html';
import { Slice } from '@tiptap/pm/model';
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

    if (slice.content.childCount === 1) {
      return false;
    }

    if (event.clipboardData?.getData?.('text/html')) {
      event.preventDefault();
      const html = event.clipboardData.getData('text/html');

      const sanitizedHtml = sanitizePastedHtml(html);

      const jsonContent = generateJSON(sanitizedHtml, extensions);
      const node = view.state.schema.nodeFromJSON(jsonContent);

      const transaction =
        node.type.name === 'doc'
          ? view.state.tr.replaceSelection(new Slice(node.content, 0, 0))
          : view.state.tr.replaceSelectionWith(node, false);
      view.dispatch(transaction);

      return true;
    }
    return false;
  };
}
