import { useMemo } from 'react';
import { createImageExtension } from './extension';
import type { UseEditorImageOptions } from './types';

export { imageSlashCommand } from './slash-command';
export type { UploadImageResult, UseEditorImageOptions } from './types';

export function useEditorImage(options: UseEditorImageOptions) {
  return useMemo(
    () => createImageExtension(options),
    [options.uploadImage, options.onUploadError],
  );
}
