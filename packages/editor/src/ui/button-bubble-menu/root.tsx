import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import * as React from 'react';
import { ButtonBubbleMenuContext } from './context';

export interface ButtonBubbleMenuRootProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Called when the bubble menu hides */
  onHide?: () => void;
  /** Placement relative to cursor (default: 'top') */
  placement?: 'top' | 'bottom';
  /** Offset from cursor in px (default: 8) */
  offset?: number;
  children: React.ReactNode;
}

export function ButtonBubbleMenuRoot({
  onHide,
  placement = 'top',
  offset = 8,
  className,
  children,
  ...rest
}: ButtonBubbleMenuRootProps) {
  const { editor } = useCurrentEditor();
  const [isEditing, setIsEditing] = React.useState(false);

  const buttonHref = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      (e?.getAttributes('button').href as string) ?? '',
  });

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="buttonBubbleMenu"
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
      {...rest}
    >
      <ButtonBubbleMenuContext.Provider
        value={{
          editor,
          buttonHref: buttonHref ?? '',
          isEditing,
          setIsEditing,
        }}
      >
        {children}
      </ButtonBubbleMenuContext.Provider>
    </BubbleMenu>
  );
}
