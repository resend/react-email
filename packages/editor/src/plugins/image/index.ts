import { useMemo } from 'react';
import { createImageExtension } from './extension';
import type { UseEditorImageOptions } from './types';

export type { UseEditorImageOptions } from './types';
export { imageSlashCommand } from './slash-command';

export function useEditorImage(options: UseEditorImageOptions) {
  return useMemo(
    () => createImageExtension(options),
    [options.uploadImage, options.onUploadError],
  );
}
