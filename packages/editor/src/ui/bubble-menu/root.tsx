import { useCurrentEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import type * as React from 'react';
import { BubbleMenuContext } from './context.js';

export interface BubbleMenuRootProps {
  /** Node types that should NOT trigger the bubble menu */
  excludeNodes?: string[];
  /** Placement relative to selection */
  placement?: 'top' | 'bottom';
  /** Offset from selection in px */
  offset?: number;
  /** Called when the bubble menu is hidden (e.g., click outside, selection cleared) */
  onHide?: () => void;
  /** Additional className on the outer wrapper */
  className?: string;
  children: React.ReactNode;
}

export function BubbleMenuRoot({
  excludeNodes = [],
  placement = 'bottom',
  offset = 8,
  onHide,
  className,
  children,
}: BubbleMenuRootProps) {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      data-re-bubble-menu=""
      shouldShow={({ editor, view }) => {
        for (const node of excludeNodes) {
          if (editor.isActive(node)) {
            return false;
          }
        }
        if (view.dom.classList.contains('dragging')) {
          return false;
        }
        return editor.view.state.selection.content().size > 0;
      }}
      options={{
        placement,
        offset,
        onHide,
      }}
      className={className}
    >
      <BubbleMenuContext.Provider value={{ editor }}>
        {children}
      </BubbleMenuContext.Provider>
    </BubbleMenu>
  );
}
