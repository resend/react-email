'use client';

import type { Editor } from '@tiptap/core';
import { useCurrentEditor } from '@tiptap/react';
import type { BubbleMenuProps } from '@tiptap/react/menus';
import { BubbleMenu } from '@tiptap/react/menus';
import type * as React from 'react';

type ShowWhen =
  | 'textSelection'
  | 'nodeSelection'
  | ((editor: Editor) => boolean);

interface BubbleMenuRootProps {
  showWhen?: ShowWhen;
  excludeNodes?: string[];
  placement?: 'top' | 'bottom';
  className?: string;
  children: React.ReactNode;
  onHide?: () => void;
}

function buildShouldShow(
  showWhen: ShowWhen,
  excludeNodes: string[],
): NonNullable<BubbleMenuProps['shouldShow']> {
  return ({ editor, view }) => {
    for (const node of excludeNodes) {
      if (editor.isActive(node)) {
        return false;
      }
    }

    if (view.dom.classList.contains('dragging')) {
      return false;
    }

    if (typeof showWhen === 'function') {
      return showWhen(editor);
    }

    if (showWhen === 'nodeSelection') {
      return !editor.state.selection.empty && 'node' in editor.state.selection;
    }

    // default: textSelection
    return editor.view.state.selection.content().size > 0;
  };
}

function BubbleMenuRoot({
  showWhen = 'textSelection',
  excludeNodes = [],
  placement = 'bottom',
  className,
  children,
  onHide,
}: BubbleMenuRootProps) {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const shouldShow = buildShouldShow(showWhen, excludeNodes);

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      options={{
        placement,
        offset: 8,
        onHide,
      }}
    >
      <div data-part="bubble-menu-root" className={className}>
        {children}
      </div>
    </BubbleMenu>
  );
}

interface BubbleMenuGroupProps {
  className?: string;
  children: React.ReactNode;
}

function BubbleMenuGroup({ className, children }: BubbleMenuGroupProps) {
  return (
    <div data-part="bubble-menu-group" className={className}>
      {children}
    </div>
  );
}

interface BubbleMenuButtonProps {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: (editor: Editor) => boolean;
  command: (editor: Editor) => void;
  className?: string;
  children?: React.ReactNode;
}

function BubbleMenuButton({
  name,
  icon: Icon,
  isActive,
  command,
  className,
  children,
}: BubbleMenuButtonProps) {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const active = isActive ? isActive(editor) : false;

  return (
    <button
      data-part="bubble-menu-button"
      data-active={active || undefined}
      aria-pressed={active}
      aria-label={name}
      onClick={() => command(editor)}
      className={className}
      type="button"
    >
      {children ?? <Icon />}
    </button>
  );
}

interface BubbleMenuSeparatorProps {
  className?: string;
}

function BubbleMenuSeparator({ className }: BubbleMenuSeparatorProps) {
  return (
    <hr
      data-part="bubble-menu-separator"
      aria-orientation="vertical"
      className={className}
    />
  );
}

export {
  BubbleMenuRoot,
  BubbleMenuGroup,
  BubbleMenuButton,
  BubbleMenuSeparator,
};
export type {
  BubbleMenuRootProps,
  BubbleMenuGroupProps,
  BubbleMenuButtonProps,
  BubbleMenuSeparatorProps,
};
