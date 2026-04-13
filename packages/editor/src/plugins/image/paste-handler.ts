import type { Editor } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { UseEditorImageOptions } from './types';
import { executeUploadFlow } from './upload-flow';

export function createImagePastePlugin(
  editor: Editor,
  uploadImage: UseEditorImageOptions['uploadImage'],
  onUploadError?: UseEditorImageOptions['onUploadError'],
) {
  return new Plugin({
    key: new PluginKey('imagePaste'),
    props: {
      handlePaste(_view, event) {
        const file = event.clipboardData?.files?.[0];
        if (!file?.type.includes('image/')) {
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
