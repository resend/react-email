import { useCurrentEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import type * as React from 'react';
import { BubbleMenuContext } from './context';

export interface BubbleMenuRootProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Node types that should NOT trigger the bubble menu */
  excludeNodes?: string[];
  /** Mark types that should NOT trigger the bubble menu */
  excludeMarks?: string[];
  /** Placement relative to selection */
  placement?: 'top' | 'bottom';
  /** Offset from selection in px */
  offset?: number;
  /** Called when the bubble menu is hidden (e.g., click outside, selection cleared) */
  onHide?: () => void;
  children: React.ReactNode;
}

export function BubbleMenuRoot({
  excludeNodes = [],
  excludeMarks = [],
  placement = 'bottom',
  offset = 8,
  onHide,
  className,
  children,
  ...rest
}: BubbleMenuRootProps) {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="textBubbleMenu"
      data-re-bubble-menu=""
      shouldShow={({ editor, view, state }) => {
        for (const node of excludeNodes) {
          if (editor.isActive(node)) {
            return false;
          }
          const { $from } = state.selection;
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === node) {
              return false;
            }
          }
        }
        for (const mark of excludeMarks) {
          if (editor.isActive(mark)) {
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
      {...rest}
    >
      <BubbleMenuContext.Provider value={{ editor }}>
        {children}
      </BubbleMenuContext.Provider>
    </BubbleMenu>
  );
}
