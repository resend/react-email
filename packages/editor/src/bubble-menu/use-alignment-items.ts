'use client';

import type { Editor } from '@tiptap/core';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import type { BubbleMenuItemConfig } from './use-formatting-items';

interface UseAlignmentItemsOptions {
  exclude?: string[];
}

const DEFAULT_ALIGNMENT_ITEMS: Array<{
  name: string;
  alignment: string;
  command: (editor: Editor) => void;
}> = [
  {
    name: 'Align Left',
    alignment: 'left',
    command: (ed) => ed.chain().focus().setAlignment('left').run(),
  },
  {
    name: 'Align Center',
    alignment: 'center',
    command: (ed) => ed.chain().focus().setAlignment('center').run(),
  },
  {
    name: 'Align Right',
    alignment: 'right',
    command: (ed) => ed.chain().focus().setAlignment('right').run(),
  },
];

function useAlignmentItems(
  options: UseAlignmentItemsOptions = {},
): BubbleMenuItemConfig[] {
  const { exclude = [] } = options;

  const { editor } = useCurrentEditor();

  const filtered = DEFAULT_ALIGNMENT_ITEMS.filter(
    (item) => !exclude.includes(item.name),
  );

  const activeStates = useEditorState({
    editor,
    selector: ({ editor: ed }): Record<string, boolean> => {
      if (!ed) return {};
      const states: Record<string, boolean> = {};
      for (const item of filtered) {
        states[item.name] = ed.isActive({ alignment: item.alignment });
      }
      return states;
    },
  });

  return filtered.map((item) => ({
    name: item.name,
    isActive: activeStates[item.name] ?? false,
    command: item.command,
  }));
}

export { useAlignmentItems };
export type { UseAlignmentItemsOptions };
