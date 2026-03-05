import type { Editor } from '@tiptap/core';
import * as React from 'react';

export interface ImageBubbleMenuContextValue {
  editor: Editor;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const ImageBubbleMenuContext =
  React.createContext<ImageBubbleMenuContextValue | null>(null);

export function useImageBubbleMenuContext(): ImageBubbleMenuContextValue {
  const context = React.useContext(ImageBubbleMenuContext);
  if (!context) {
    throw new Error(
      'ImageBubbleMenu compound components must be used within <ImageBubbleMenu.Root>',
    );
  }
  return context;
}
