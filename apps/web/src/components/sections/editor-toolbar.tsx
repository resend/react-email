'use client';

import * as Popover from '@radix-ui/react-popover';
import type { Editor } from '@tiptap/core';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import classNames from 'classnames';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Strikethrough,
  Type,
  Underline,
  Unlink,
} from 'lucide-react';
import * as React from 'react';

const SAFE_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function getUrlFromString(str: string): string | null {
  if (str === '#') return str;
  try {
    const url = new URL(str);
    if (SAFE_URL_PROTOCOLS.has(url.protocol)) return str;
    return null;
  } catch {}
  try {
    if (str.includes('.') && !str.includes(' '))
      return new URL(`https://${str}`).toString();
  } catch {}
  return null;
}

function setLinkHref(editor: Editor, href: string) {
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

function setTextAlignment(editor: Editor, alignment: string) {
  const { from, to } = editor.state.selection;
  const tr = editor.state.tr;
  editor.state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.isTextblock) {
      const prop = 'align' in node.attrs ? 'align' : 'alignment';
      tr.setNodeMarkup(pos, null, { ...node.attrs, [prop]: alignment });
    }
  });
  editor.view.dispatch(tr);
}

interface ToolbarButtonProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({
  label,
  isActive = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={classNames(
        'inline-flex items-center justify-center rounded p-1.5 text-gray-400 focus-visible:outline-none transition-colors',
        isActive
          ? 'bg-black/5 text-gray-900'
          : 'hover:bg-black/5 hover:text-gray-700',
      )}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="mx-0.5 w-px self-stretch bg-gray-100" />;
}

const NODE_ITEMS: {
  name: string;
  Icon: React.ComponentType<{ size?: number }>;
  command: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}[] = [
  {
    name: 'Text',
    Icon: Type,
    command: (editor) =>
      editor
        .chain()
        .focus()
        .clearNodes()
        .toggleNode('paragraph', 'paragraph')
        .run(),
    isActive: (editor) =>
      editor.isActive('paragraph') &&
      !editor.isActive('bulletList') &&
      !editor.isActive('orderedList'),
  },
  {
    name: 'Title',
    Icon: Heading1,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  {
    name: 'Heading',
    Icon: Heading2,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    name: 'Subheading',
    Icon: Heading3,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    name: 'Bullet List',
    Icon: List,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  {
    name: 'Numbered List',
    Icon: ListOrdered,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
];

function NodeSelector({ editor }: { editor: Editor }) {
  const [open, setOpen] = React.useState(false);

  const activeName = useEditorState({
    editor,
    selector: ({ editor }) => {
      const item = NODE_ITEMS.find((item) => editor && item.isActive(editor));
      return item?.name ?? 'Mixed';
    },
  });

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium text-gray-700 focus-visible:outline-none transition-colors hover:bg-black/5"
        >
          {activeName}
          <ChevronDown size={12} className="opacity-50" />
        </button>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        sideOffset={4}
        className="z-50 min-w-36 rounded-xl border border-gray-100 bg-white p-1 shadow-lg"
      >
        {NODE_ITEMS.map(({ name, Icon, command, isActive }) => (
          <button
            key={name}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              command(editor);
              setOpen(false);
            }}
            className={classNames(
              'focus-visible:outline-none flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors',
              isActive(editor)
                ? 'font-medium text-gray-900'
                : 'text-gray-500 hover:bg-black/5 hover:text-gray-900',
            )}
          >
            <Icon size={14} />
            {name}
          </button>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
}

function LinkSelector({ editor }: { editor: Editor }) {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState('');

  const linkState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isActive: editor?.isActive('link') ?? false,
      href: (editor?.getAttributes('link').href as string) || '',
    }),
  });

  React.useEffect(() => {
    if (open) {
      const href = linkState?.href ?? '';
      setInputValue(href === '#' ? '' : href);
      const id = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [open, linkState?.href]);

  const handleApply = () => {
    const value = inputValue.trim();
    setLinkHref(editor, value ? (getUrlFromString(value) ?? '') : '');
    setOpen(false);
    setTimeout(() => editor.commands.focus(), 0);
  };

  const handleUnlink = () => {
    setLinkHref(editor, '');
    setOpen(false);
    setTimeout(() => editor.commands.focus(), 0);
  };

  if (!linkState) return null;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Link"
          aria-pressed={linkState.isActive}
          onMouseDown={(e) => e.preventDefault()}
          className={classNames(
            'inline-flex items-center justify-center rounded p-1.5 text-gray-400 focus-visible:outline-none transition-colors',
            linkState.isActive
              ? 'bg-black/5 text-gray-900'
              : 'hover:bg-black/5 hover:text-gray-700',
          )}
        >
          <Link size={14} />
        </button>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="z-50 flex items-center gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-lg"
      >
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleApply();
            }
            if (e.key === 'Escape') setOpen(false);
          }}
          placeholder="Paste a link"
          className="min-w-48 px-2 py-1 text-xs text-gray-700 focus-visible:outline-none placeholder:text-gray-400"
        />
        {linkState.href ? (
          <button
            type="button"
            aria-label="Remove link"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleUnlink}
            className="inline-flex items-center justify-center rounded p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Unlink size={14} />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Apply link"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleApply}
            className="inline-flex items-center justify-center rounded p-1.5 text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-700"
          >
            <Check size={14} />
          </button>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}

export function EditorToolbar({ className }: { className?: string }) {
  const { editor } = useCurrentEditor();

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive('bold') ?? false,
      isItalic: editor?.isActive('italic') ?? false,
      isUnderline: editor?.isActive('underline') ?? false,
      isStrike: editor?.isActive('strike') ?? false,
      isCode: editor?.isActive('code') ?? false,
      isAlignLeft: editor?.isActive({ alignment: 'left' }) ?? false,
      isAlignCenter: editor?.isActive({ alignment: 'center' }) ?? false,
      isAlignRight: editor?.isActive({ alignment: 'right' }) ?? false,
    }),
  });

  if (!editor || !state) return null;

  return (
    <div
      className={classNames(
        'order-[-1] flex shrink-0 items-center gap-0.5 border-b border-gray-100 px-2 py-1',
        className,
      )}
    >
      <NodeSelector editor={editor} />
      <Separator />
      <ToolbarButton
        label="Bold"
        isActive={state.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        isActive={state.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        isActive={state.isUnderline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        isActive={state.isStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Code"
        isActive={state.isCode}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={14} />
      </ToolbarButton>
      <LinkSelector editor={editor} />
      <Separator />
      <ToolbarButton
        label="Align left"
        isActive={state.isAlignLeft}
        onClick={() => setTextAlignment(editor, 'left')}
      >
        <AlignLeft size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Align center"
        isActive={state.isAlignCenter}
        onClick={() => setTextAlignment(editor, 'center')}
      >
        <AlignCenter size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Align right"
        isActive={state.isAlignRight}
        onClick={() => setTextAlignment(editor, 'right')}
      >
        <AlignRight size={14} />
      </ToolbarButton>
    </div>
  );
}
