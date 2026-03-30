import { useCurrentEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import * as React from 'react';
import { ImageBubbleMenuContext } from './context';

export interface ImageBubbleMenuRootProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Called when the bubble menu hides */
  onHide?: () => void;
  /** Placement relative to cursor (default: 'top') */
  placement?: 'top' | 'bottom';
  /** Offset from cursor in px (default: 8) */
  offset?: number;
  children: React.ReactNode;
}

export function ImageBubbleMenuRoot({
  onHide,
  placement = 'top',
  offset = 8,
  className,
  children,
  ...rest
}: ImageBubbleMenuRootProps) {
  const { editor } = useCurrentEditor();
  const [isEditing, setIsEditing] = React.useState(false);

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="imageBubbleMenu"
      data-re-img-bm=""
      shouldShow={({ editor: e, view }) =>
        e.isActive('image') && !view.dom.classList.contains('dragging')
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
      {...rest}
    >
      <ImageBubbleMenuContext.Provider
        value={{ editor, isEditing, setIsEditing }}
      >
        {children}
      </ImageBubbleMenuContext.Provider>
    </BubbleMenu>
  );
}
