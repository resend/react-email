import { useMemo, useRef } from 'react';
import { createImageExtension } from './extension';
import type { UseEditorImageOptions } from './types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (attrs: {
        src: string;
        alt?: string;
        width?: string;
        height?: string;
        alignment?: string;
        href?: string;
      }) => ReturnType;
      uploadImage: () => ReturnType;
    };
  }
}

export { imageSlashCommand } from './slash-command';
export type { UploadImageResult, UseEditorImageOptions } from './types';

export function useEditorImage(options: UseEditorImageOptions) {
  const uploadImageRef = useRef(options.uploadImage);
  uploadImageRef.current = options.uploadImage;

  return useMemo(
    () =>
      createImageExtension({
        uploadImage: (file) => uploadImageRef.current(file),
      }),
    [],
  );
}
