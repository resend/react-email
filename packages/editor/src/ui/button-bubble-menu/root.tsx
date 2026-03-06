import { useCurrentEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import * as React from 'react';
import { ButtonBubbleMenuContext } from './context';

export interface ButtonBubbleMenuRootProps {
  /** Called when the bubble menu hides */
  onHide?: () => void;
  /** Placement relative to cursor (default: 'top') */
  placement?: 'top' | 'bottom';
  /** Offset from cursor in px (default: 8) */
  offset?: number;
  /** className on the outer wrapper */
  className?: string;
  children: React.ReactNode;
}

export function ButtonBubbleMenuRoot({
  onHide,
  placement = 'top',
  offset = 8,
  className,
  children,
}: ButtonBubbleMenuRootProps) {
  const { editor } = useCurrentEditor();
  const [isEditing, setIsEditing] = React.useState(false);

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      data-re-btn-bm=""
      shouldShow={({ editor: e, view }) =>
        e.isActive('button') && !view.dom.classList.contains('dragging')
      }
      options={{
        placement,
        offset,
        onHide: () => {
          setIsEditing(false);
          onHide?.();
        },
      }}
      className={className}
    >
      <ButtonBubbleMenuContext.Provider
        value={{ editor, isEditing, setIsEditing }}
      >
        {children}
      </ButtonBubbleMenuContext.Provider>
    </BubbleMenu>
  );
}
