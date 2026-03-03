'use client';

import type { Editor } from '@tiptap/core';
import { useCurrentEditor, useEditorState } from '@tiptap/react';

interface BubbleMenuItemConfig {
  name: string;
  isActive: boolean;
  command: (editor: Editor) => void;
}

interface UseFormattingItemsOptions {
  exclude?: string[];
  extra?: Array<{
    name: string;
    isActive: (editor: Editor) => boolean;
    command: (editor: Editor) => void;
  }>;
}

const DEFAULT_FORMATTING_ITEMS: Array<{
  name: string;
  mark: string;
  command: (editor: Editor) => void;
}> = [
  {
    name: 'Bold',
    mark: 'bold',
    command: (ed) => ed.chain().focus().toggleBold().run(),
  },
  {
    name: 'Italic',
    mark: 'italic',
    command: (ed) => ed.chain().focus().toggleItalic().run(),
  },
  {
    name: 'Underline',
    mark: 'underline',
    command: (ed) => ed.chain().focus().toggleUnderline().run(),
  },
  {
    name: 'Strike',
    mark: 'strike',
    command: (ed) => ed.chain().focus().toggleStrike().run(),
  },
  {
    name: 'Code',
    mark: 'code',
    command: (ed) => ed.chain().focus().toggleCode().run(),
  },
  {
    name: 'Uppercase',
    mark: 'uppercase',
    command: (ed) => ed.chain().focus().toggleUppercase().run(),
  },
];

function useFormattingItems(
  options: UseFormattingItemsOptions = {},
): BubbleMenuItemConfig[] {
  const { exclude = [], extra = [] } = options;

  const { editor } = useCurrentEditor();

  const filtered = DEFAULT_FORMATTING_ITEMS.filter(
    (item) => !exclude.includes(item.name),
  );

  const activeStates = useEditorState({
    editor,
    selector: ({ editor: ed }): Record<string, boolean> => {
      if (!ed) return {};
      const states: Record<string, boolean> = {};
      for (const item of filtered) {
        states[item.name] = ed.isActive(item.mark);
      }
      for (const item of extra) {
        states[item.name] = item.isActive(ed);
      }
      return states;
    },
  });

  const items: BubbleMenuItemConfig[] = filtered.map((item) => ({
    name: item.name,
    isActive: activeStates[item.name] ?? false,
    command: item.command,
  }));

  for (const item of extra) {
    items.push({
      name: item.name,
      isActive: activeStates[item.name] ?? false,
      command: item.command,
    });
  }

  return items;
}

export { useFormattingItems };
export type { BubbleMenuItemConfig, UseFormattingItemsOptions };
