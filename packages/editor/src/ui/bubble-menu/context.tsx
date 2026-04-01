import type { Editor } from '@tiptap/core';
import * as React from 'react';

export interface BubbleMenuContextValue {
  editor: Editor;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const BubbleMenuContext =
  React.createContext<BubbleMenuContextValue | null>(null);

export function useBubbleMenuContext(): BubbleMenuContextValue {
  const context = React.useContext(BubbleMenuContext);
  if (!context) {
    throw new Error(
      'BubbleMenu compound components must be used within <BubbleMenu.Root>',
    );
  }
  return context;
}
