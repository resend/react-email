'use client';

import { useCurrentEditor, useEditorState } from '@tiptap/react';

function BoldSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 2.5h4.5a3 3 0 0 1 2.1 5.15A3.25 3.25 0 0 1 9 13.5H4V2.5Zm1.5 1.5v3h3a1.5 1.5 0 1 0 0-3h-3Zm0 4.5v3h3.5a1.75 1.75 0 1 0 0-3.5H5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ItalicSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 2.5h6M3.5 13.5h6M9.5 2.5 6.5 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UnderlineSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 2.5v5a4 4 0 0 0 8 0v-5M3 14h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StrikethroughSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 3.5A2.5 2.5 0 0 1 8 2c1.6 0 3 .9 3 2.5 0 .8-.4 1.4-1 1.8M3 8h10M10.5 12.5A2.5 2.5 0 0 1 8 14c-1.6 0-3-.9-3-2.5 0-.8.4-1.4 1-1.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CodeSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 4.5 1.5 8 5 11.5M11 4.5 14.5 8 11 11.5M9.5 2.5l-3 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UppercaseSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 13 4.5 3 8 13M2.25 10h4.5M10 13l2.5-7 2.5 7M10.75 11h3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlignLeftSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 3.5h12M2 8h8M2 12.5h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AlignCenterSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 3.5h12M4 8h8M3 12.5h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AlignRightSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 3.5h12M6 8h8M4 12.5h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
      <BoldSvg />
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
      <ItalicSvg />
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
      <UnderlineSvg />
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
      <StrikethroughSvg />
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
      <CodeSvg />
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
      <UppercaseSvg />
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
      <AlignLeftSvg />
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
      <AlignCenterSvg />
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
      <AlignRightSvg />
    </button>
  );
}
