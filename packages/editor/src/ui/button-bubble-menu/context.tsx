import type { Editor } from '@tiptap/core';
import * as React from 'react';

export interface ButtonBubbleMenuContextValue {
  editor: Editor;
  buttonHref: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const ButtonBubbleMenuContext =
  React.createContext<ButtonBubbleMenuContextValue | null>(null);

export function useButtonBubbleMenuContext(): ButtonBubbleMenuContextValue {
  const context = React.useContext(ButtonBubbleMenuContext);
  if (!context) {
    throw new Error(
      'ButtonBubbleMenu compound components must be used within <ButtonBubbleMenu.Root>',
    );
  }
  return context;
}
