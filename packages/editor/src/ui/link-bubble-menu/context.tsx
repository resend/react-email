import type { Editor } from '@tiptap/core';
import * as React from 'react';

export interface LinkBubbleMenuContextValue {
  editor: Editor;
  linkHref: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const LinkBubbleMenuContext =
  React.createContext<LinkBubbleMenuContextValue | null>(null);

export function useLinkBubbleMenuContext(): LinkBubbleMenuContextValue {
  const context = React.useContext(LinkBubbleMenuContext);
  if (!context) {
    throw new Error(
      'LinkBubbleMenu compound components must be used within <LinkBubbleMenu.Root>',
    );
  }
  return context;
}
