import type { EditorView } from '@tiptap/pm/view';
import type { PasteHandler, UploadImageHandler } from './create-paste-handler';

export function createDropHandler({
  onPaste,
  onUploadImage,
}: {
  onPaste?: PasteHandler;
  onUploadImage?: UploadImageHandler;
}) {
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

      if (file.type.includes('image/') && onUploadImage) {
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

        // here we deduct 1 from the pos or else the image will create an extra node
        void onUploadImage(file, view, (coordinates?.pos || 0) - 1);

        return true;
      }
    }
    return false;
  };
}
