import { PluginKey } from '@tiptap/pm/state';
import { useCurrentEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import * as React from 'react';
import { BubbleMenuContext } from './context';
import { bubbleMenuTriggers, type ShouldShowFn } from './triggers';

export interface BubbleMenuRootProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  shouldShow?: ShouldShowFn;
  pluginKey?: PluginKey;
  hideWhenActiveNodes?: string[];
  hideWhenActiveMarks?: string[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  children: React.ReactNode;
}

export function BubbleMenuRoot({
  shouldShow,
  pluginKey = new PluginKey('bubbleMenu'),
  hideWhenActiveNodes = [],
  hideWhenActiveMarks = [],
  placement = 'bottom',
  offset = 8,
  onHide,
  className,
  children,
  ...rest
}: BubbleMenuRootProps) {
  const { editor } = useCurrentEditor();
  const [isEditing, setIsEditing] = React.useState(false);

  const resolvedShouldShow =
    shouldShow ??
    bubbleMenuTriggers.textSelection(hideWhenActiveNodes, hideWhenActiveMarks);

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={pluginKey}
      data-re-bubble-menu=""
      shouldShow={resolvedShouldShow}
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
      <BubbleMenuContext.Provider value={{ editor, isEditing, setIsEditing }}>
        {children}
      </BubbleMenuContext.Provider>
    </BubbleMenu>
  );
}
