'use client';

import type { Editor } from '@tiptap/core';
import { useCurrentEditor, useEditorState } from '@tiptap/react';

interface UseNodeSelectorItemsOptions {
  exclude?: string[];
}

interface NodeSelectorItemConfig {
  name: string;
  isActive: boolean;
  command: (editor: Editor) => void;
}

const DEFAULT_NODE_SELECTOR_ITEMS: Array<{
  name: string;
  command: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}> = [
  {
    name: 'Text',
    command: (ed) =>
      ed
        .chain()
        .focus()
        .clearNodes()
        .toggleNode('paragraph', 'paragraph')
        .run(),
    isActive: (ed) =>
      ed.isActive('paragraph') &&
      !ed.isActive('bulletList') &&
      !ed.isActive('orderedList'),
  },
  {
    name: 'Title',
    command: (ed) =>
      ed.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (ed) => ed.isActive('heading', { level: 1 }),
  },
  {
    name: 'Subtitle',
    command: (ed) =>
      ed.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (ed) => ed.isActive('heading', { level: 2 }),
  },
  {
    name: 'Heading',
    command: (ed) =>
      ed.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (ed) => ed.isActive('heading', { level: 3 }),
  },
  {
    name: 'Bullet List',
    command: (ed) => ed.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (ed) => ed.isActive('bulletList'),
  },
  {
    name: 'Numbered List',
    command: (ed) => ed.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (ed) => ed.isActive('orderedList'),
  },
  {
    name: 'Quote',
    command: (ed) =>
      ed
        .chain()
        .focus()
        .clearNodes()
        .toggleNode('paragraph', 'paragraph')
        .toggleBlockquote()
        .run(),
    isActive: (ed) => ed.isActive('blockquote'),
  },
  {
    name: 'Code',
    command: (ed) => ed.chain().focus().clearNodes().toggleCodeBlock().run(),
    isActive: (ed) => ed.isActive('codeBlock'),
  },
];

function useNodeSelectorItems(options: UseNodeSelectorItemsOptions = {}): {
  items: NodeSelectorItemConfig[];
  activeItemName: string;
} {
  const { exclude = [] } = options;

  const { editor } = useCurrentEditor();

  const filtered = DEFAULT_NODE_SELECTOR_ITEMS.filter(
    (item) => !exclude.includes(item.name),
  );

  const result = useEditorState({
    editor,
    selector: ({
      editor: ed,
    }): { activeStates: Record<string, boolean>; activeItemName: string } => {
      if (!ed) {
        return { activeStates: {}, activeItemName: 'Multiple' };
      }
      const activeStates: Record<string, boolean> = {};
      let activeItemName = 'Multiple';
      for (const item of filtered) {
        const active = item.isActive(ed);
        activeStates[item.name] = active;
        if (active && activeItemName === 'Multiple') {
          activeItemName = item.name;
        }
      }
      return { activeStates, activeItemName };
    },
  });

  const items: NodeSelectorItemConfig[] = filtered.map((item) => ({
    name: item.name,
    isActive: result.activeStates[item.name] ?? false,
    command: item.command,
  }));

  return { items, activeItemName: result.activeItemName };
}

export { useNodeSelectorItems };
export type { UseNodeSelectorItemsOptions, NodeSelectorItemConfig };
