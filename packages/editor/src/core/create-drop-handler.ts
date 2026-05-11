import type { EditorView } from '@tiptap/pm/view';
import type { PasteHandler } from './create-paste-handler';

export function createDropHandler({ onPaste }: { onPaste?: PasteHandler }) {
  return (
    view: EditorView,
    event: DragEvent,
    _slice: unknown,
    moved: boolean,
  ): boolean => {
    if (
      !moved &&
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files[0]
    ) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];

      if (onPaste?.(file, view)) {
        return true;
      }
    }
    return false;
  };
}
