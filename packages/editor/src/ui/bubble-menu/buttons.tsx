'use client';

import { useCurrentEditor, useEditorState } from '@tiptap/react';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CaseUpperIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';

export function BoldButton({ className }: { className?: string }) {
  const { editor } = useCurrentEditor();
  const isActive = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isActive('bold') ?? false,
  });

  if (!editor) return null;

  return (
    <button
      data-part="bubble-menu-button"
      data-active={isActive || undefined}
      aria-pressed={isActive}
      aria-label="Bold"
      onClick={() => editor.chain().focus().toggleBold().run()}
      className={className}
      type="button"
    >
      <BoldIcon />
    </button>
  );
}

export function ItalicButton({ className }: { className?: string }) {
  const { editor } = useCurrentEditor();
  const isActive = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isActive('italic') ?? false,
  });

  if (!editor) return null;

  return (
    <button
      data-part="bubble-menu-button"
      data-active={isActive || undefined}
      aria-pressed={isActive}
      aria-label="Italic"
      onClick={() => editor.chain().focus().toggleItalic().run()}
      className={className}
      type="button"
    >
      <ItalicIcon />
    </button>
  );
}

export function UnderlineButton({ className }: { className?: string }) {
  const { editor } = useCurrentEditor();
  const isActive = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isActive('underline') ?? false,
  });

  if (!editor) return null;

  return (
    <button
      data-part="bubble-menu-button"
      data-active={isActive || undefined}
      aria-pressed={isActive}
      aria-label="Underline"
      onClick={() => editor.chain().focus().toggleUnderline().run()}
      className={className}
      type="button"
    >
      <UnderlineIcon />
    </button>
  );
}

export function StrikeButton({ className }: { className?: string }) {
  const { editor } = useCurrentEditor();
  const isActive = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isActive('strike') ?? false,
  });

  if (!editor) return null;

  return (
    <button
      data-part="bubble-menu-button"
      data-active={isActive || undefined}
      aria-pressed={isActive}
      aria-label="Strikethrough"
      onClick={() => editor.chain().focus().toggleStrike().run()}
      className={className}
      type="button"
    >
      <StrikethroughIcon />
    </button>
  );
}

export function CodeButton({ className }: { className?: string }) {
  const { editor } = useCurrentEditor();
  const isActive = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isActive('code') ?? false,
  });

  if (!editor) return null;

  return (
    <button
      data-part="bubble-menu-button"
      data-active={isActive || undefined}
      aria-pressed={isActive}
      aria-label="Code"
      onClick={() => editor.chain().focus().toggleCode().run()}
      className={className}
      type="button"
    >
      <CodeIcon />
    </button>
  );
}

export function UppercaseButton({ className }: { className?: string }) {
  const { editor } = useCurrentEditor();
  const isActive = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isActive('uppercase') ?? false,
  });

  if (!editor) return null;

  return (
    <button
      data-part="bubble-menu-button"
      data-active={isActive || undefined}
      aria-pressed={isActive}
      aria-label="Uppercase"
      onClick={() => editor.chain().focus().toggleUppercase().run()}
      className={className}
      type="button"
    >
      <CaseUpperIcon />
    </button>
  );
}

export function AlignLeftButton({ className }: { className?: string }) {
  const { editor } = useCurrentEditor();
  const isActive = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isActive({ alignment: 'left' }) ?? false,
  });

  if (!editor) return null;

  return (
    <button
      data-part="bubble-menu-button"
      data-active={isActive || undefined}
      aria-pressed={isActive}
      aria-label="Align left"
      onClick={() => editor.chain().focus().setAlignment('left').run()}
      className={className}
      type="button"
    >
      <AlignLeftIcon />
    </button>
  );
}

export function AlignCenterButton({ className }: { className?: string }) {
  const { editor } = useCurrentEditor();
  const isActive = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isActive({ alignment: 'center' }) ?? false,
  });

  if (!editor) return null;

  return (
    <button
      data-part="bubble-menu-button"
      data-active={isActive || undefined}
      aria-pressed={isActive}
      aria-label="Align center"
      onClick={() => editor.chain().focus().setAlignment('center').run()}
      className={className}
      type="button"
    >
      <AlignCenterIcon />
    </button>
  );
}

export function AlignRightButton({ className }: { className?: string }) {
  const { editor } = useCurrentEditor();
  const isActive = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isActive({ alignment: 'right' }) ?? false,
  });

  if (!editor) return null;

  return (
    <button
      data-part="bubble-menu-button"
      data-active={isActive || undefined}
      aria-pressed={isActive}
      aria-label="Align right"
      onClick={() => editor.chain().focus().setAlignment('right').run()}
      className={className}
      type="button"
    >
      <AlignRightIcon />
    </button>
  );
}
