'use client';

import type { Editor } from '@tiptap/core';
import { useCurrentEditor } from '@tiptap/react';
import { useCallback } from 'react';

interface UseBubbleMenuOptions {
  showWhen?: 'textSelection' | 'nodeSelection' | ((editor: Editor) => boolean);
  excludeNodes?: string[];
  placement?: 'top' | 'bottom';
}

interface UseBubbleMenuReturn {
  editor: Editor | null;
  shouldShow: (props: { editor: Editor; view: any }) => boolean;
  bubbleMenuProps: {
    options: { placement: string; offset: number };
  };
}

function useBubbleMenu(
  options: UseBubbleMenuOptions = {},
): UseBubbleMenuReturn {
  const {
    showWhen = 'textSelection',
    excludeNodes = [],
    placement = 'bottom',
  } = options;

  const { editor } = useCurrentEditor();

  const shouldShow = useCallback(
    ({ editor: ed }: { editor: Editor; view: any }): boolean => {
      if (excludeNodes.length > 0) {
        const { $from } = ed.state.selection;
        const nodeType = $from.parent.type.name;
        if (excludeNodes.includes(nodeType)) {
          return false;
        }
      }

      if (typeof showWhen === 'function') {
        return showWhen(ed);
      }

      if (showWhen === 'nodeSelection') {
        return !ed.state.selection.empty && 'node' in ed.state.selection;
      }

      // default: textSelection
      const { from, to } = ed.state.selection;
      return from !== to && !ed.state.selection.empty;
    },
    [showWhen, excludeNodes],
  );

  const bubbleMenuProps = {
    options: {
      placement,
      offset: 8,
    },
  };

  return { editor: editor ?? null, shouldShow, bubbleMenuProps };
}

export { useBubbleMenu };
export type { UseBubbleMenuOptions, UseBubbleMenuReturn };
