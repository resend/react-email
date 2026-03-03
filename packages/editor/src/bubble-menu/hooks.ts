'use client';

import type { Editor } from '@tiptap/core';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { useCallback, useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function defaultValidateUrl(url: string): string | null | undefined {
  if (url === '#') return url;
  try {
    new URL(url);
    return url;
  } catch {
    if (url.includes('.')) {
      return `https://${url}`;
    }
    return undefined;
  }
}

function setHref(
  editor: Editor,
  element: 'link' | 'button' | 'image',
  href: string,
) {
  if (element === 'button') {
    editor.commands.updateAttributes('button', { href });
    return;
  }
  if (element === 'image') {
    editor.commands.updateAttributes('image', { href });
    return;
  }
  if (href.length === 0) {
    editor.chain().unsetLink().run();
    return;
  }
  const { from, to } = editor.state.selection;
  if (from === to) {
    editor
      .chain()
      .extendMarkRange('link')
      .setLink({ href })
      .setTextSelection({ from, to })
      .run();
    return;
  }
  editor.chain().setLink({ href }).run();
}

// ---------------------------------------------------------------------------
// 1. useBubbleMenu
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 2. useFormattingItems
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 3. useAlignmentItems
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 4. useNodeSelectorItems
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 5. useLinkForm
// ---------------------------------------------------------------------------

interface UseLinkFormOptions {
  element?: 'link' | 'button' | 'image';
  validateUrl?: (url: string) => string | null | undefined;
  onError?: (message: string) => void;
}

interface UseLinkFormReturn {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  hasLink: boolean;
  currentHref: string;
  handleSubmit: (e?: React.FormEvent) => void;
  handleUnlink: (e?: React.MouseEvent) => void;
}

function useLinkForm(options: UseLinkFormOptions = {}): UseLinkFormReturn {
  const {
    element = 'link',
    validateUrl = defaultValidateUrl,
    onError,
  } = options;

  const { editor } = useCurrentEditor();

  const currentHref = useEditorState({
    editor,
    selector: ({ editor: ed }): string => {
      if (!ed) return '';
      if (element === 'button') {
        return (ed.getAttributes('button').href as string) ?? '';
      }
      if (element === 'image') {
        return (ed.getAttributes('image').href as string) ?? '';
      }
      return (ed.getAttributes('link').href as string) ?? '';
    },
  });

  const hasLink = currentHref.length > 0;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState(currentHref);

  useEffect(() => {
    setInputValue(currentHref);
  }, [currentHref]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!editor) return;

      const trimmed = inputValue.trim();

      if (trimmed.length === 0) {
        setHref(editor, element, '');
        return;
      }

      const result = validateUrl(trimmed);
      if (result == null) {
        onError?.('Invalid URL');
        return;
      }

      setHref(editor, element, result);
    },
    [editor, element, inputValue, validateUrl, onError],
  );

  const handleUnlink = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      if (!editor) return;
      setHref(editor, element, '');
      setInputValue('');
    },
    [editor, element],
  );

  return {
    inputRef,
    inputValue,
    setInputValue,
    hasLink,
    currentHref,
    handleSubmit,
    handleUnlink,
  };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  useBubbleMenu,
  useFormattingItems,
  useAlignmentItems,
  useNodeSelectorItems,
  useLinkForm,
};

export type {
  UseBubbleMenuOptions,
  UseBubbleMenuReturn,
  BubbleMenuItemConfig,
  UseFormattingItemsOptions,
  UseAlignmentItemsOptions,
  UseNodeSelectorItemsOptions,
  UseLinkFormOptions,
  UseLinkFormReturn,
};
