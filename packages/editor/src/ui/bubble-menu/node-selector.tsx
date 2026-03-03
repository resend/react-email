'use client';

import type { Editor } from '@tiptap/core';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

type NodeSelectorItemConfig = {
  name: string;
  command: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
};

const DEFAULT_ITEMS: NodeSelectorItemConfig[] = [
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

interface NodeSelectorContextValue {
  open: boolean;
  setOpen: (state: boolean) => void;
  activeItemName: string;
  items: NodeSelectorItemConfig[];
  editor: Editor;
}

const NodeSelectorContext =
  React.createContext<NodeSelectorContextValue | null>(null);

function useNodeSelectorContext(): NodeSelectorContextValue {
  const ctx = React.useContext(NodeSelectorContext);
  if (!ctx) {
    throw new Error(
      'NodeSelector compound components must be used within <NodeSelector>',
    );
  }
  return ctx;
}

interface NodeSelectorProps {
  children: React.ReactNode;
  className?: string;
}

function NodeSelector({ children, className }: NodeSelectorProps) {
  const { editor } = useCurrentEditor();
  const [open, setOpen] = React.useState(false);

  const activeItemName = useEditorState({
    editor,
    selector: ({ editor: ed }) => {
      if (!ed) return 'Multiple';
      const active = DEFAULT_ITEMS.find((item) => item.isActive(ed));
      return active ? active.name : 'Multiple';
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <NodeSelectorContext.Provider
      value={{
        open,
        setOpen,
        activeItemName,
        items: DEFAULT_ITEMS,
        editor,
      }}
    >
      <div data-part="node-selector" className={className}>
        {children}
      </div>
    </NodeSelectorContext.Provider>
  );
}

interface NodeSelectorTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

function NodeSelectorTrigger({
  className,
  children,
}: NodeSelectorTriggerProps) {
  const { open, setOpen, activeItemName } = useNodeSelectorContext();

  return (
    <button
      data-part="node-selector-trigger"
      data-state={open ? 'open' : 'closed'}
      type="button"
      onClick={() => setOpen(!open)}
      className={className}
    >
      {children ?? (
        <>
          {activeItemName}
          <ChevronDown />
        </>
      )}
    </button>
  );
}

interface NodeSelectorContentProps {
  className?: string;
  children?: React.ReactNode;
}

function NodeSelectorContent({
  className,
  children,
}: NodeSelectorContentProps) {
  const { open, items } = useNodeSelectorContext();

  if (!open) {
    return null;
  }

  return (
    <div data-part="node-selector-content" className={className}>
      {children ??
        items.map((item) => (
          <NodeSelectorItem key={item.name} name={item.name} />
        ))}
    </div>
  );
}

interface NodeSelectorItemProps {
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  children?: React.ReactNode;
}

function NodeSelectorItem({
  name,
  icon: Icon,
  className,
  children,
}: NodeSelectorItemProps) {
  const { items, editor, setOpen } = useNodeSelectorContext();

  const item = items.find((i) => i.name === name);

  const isActive = useEditorState({
    editor,
    selector: ({ editor: ed }) => {
      if (!ed || !item) return false;
      return item.isActive(ed);
    },
  });

  if (!item) {
    return null;
  }

  const handleClick = () => {
    item.command(editor);
    setOpen(false);
  };

  return (
    <button
      data-part="node-selector-item"
      data-active={isActive || undefined}
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children ?? (
        <>
          {Icon ? <Icon /> : null}
          {name}
        </>
      )}
    </button>
  );
}

export {
  NodeSelector,
  NodeSelectorTrigger,
  NodeSelectorContent,
  NodeSelectorItem,
};
export type { NodeSelectorItemConfig };
