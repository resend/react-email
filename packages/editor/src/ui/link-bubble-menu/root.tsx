import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import * as React from 'react';
import { LinkBubbleMenuContext } from './context';

export interface LinkBubbleMenuRootProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Called when the bubble menu hides */
  onHide?: () => void;
  /** Placement relative to cursor (default: 'top') */
  placement?: 'top' | 'bottom';
  /** Offset from cursor in px (default: 8) */
  offset?: number;
  children: React.ReactNode;
}

export function LinkBubbleMenuRoot({
  onHide,
  placement = 'top',
  offset = 8,
  className,
  children,
  ...rest
}: LinkBubbleMenuRootProps) {
  const { editor } = useCurrentEditor();
  const [isEditing, setIsEditing] = React.useState(false);

  const linkHref = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      (e?.getAttributes('link').href as string) ?? '',
  });

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="linkBubbleMenu"
      data-re-link-bm=""
      shouldShow={({ editor: e }) =>
        e.isActive('link') && e.view.state.selection.content().size === 0
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
      <LinkBubbleMenuContext.Provider
        value={{ editor, linkHref: linkHref ?? '', isEditing, setIsEditing }}
      >
        {children}
      </LinkBubbleMenuContext.Provider>
    </BubbleMenu>
  );
}
