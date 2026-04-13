import type { Editor } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { UseEditorImageOptions } from './types';
import { executeUploadFlow } from './upload-flow';

export function createImageDropPlugin(
  editor: Editor,
  uploadImage: UseEditorImageOptions['uploadImage'],
  onUploadError?: UseEditorImageOptions['onUploadError'],
) {
  return new Plugin({
    key: new PluginKey('imageDrop'),
    props: {
      handleDrop(view, event, _slice, moved) {
        if (moved || !event.dataTransfer?.files?.[0]) {
          return false;
        }

        const file = event.dataTransfer.files[0];
        if (!file.type.includes('image/')) {
          return false;
        }

        event.preventDefault();
        void executeUploadFlow({
          editor,
          file,
          uploadImage,
          onUploadError,
        });

        return true;
      },
    },
  });
}
