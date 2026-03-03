'use client';

import type { Editor } from '@tiptap/core';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import * as React from 'react';

// --- Icons ---

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function UnlinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71" />
      <path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71" />
      <line x1="8" y1="2" x2="8" y2="5" />
      <line x1="2" y1="8" x2="5" y2="8" />
      <line x1="16" y1="19" x2="16" y2="22" />
      <line x1="19" y1="16" x2="22" y2="16" />
    </svg>
  );
}

// --- Helpers ---

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

// --- Context ---

interface LinkFormContextValue {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  hasLink: boolean;
  currentHref: string;
  handleSubmit: (e: React.FormEvent) => void;
  handleUnlink: (e: React.MouseEvent) => void;
  element: 'link' | 'button' | 'image';
}

const LinkFormContext = React.createContext<LinkFormContextValue | null>(null);

function useLinkFormContext(): LinkFormContextValue {
  const context = React.useContext(LinkFormContext);
  if (!context) {
    throw new Error(
      'LinkForm compound components must be used within <LinkForm>',
    );
  }
  return context;
}

// --- Hooks ---

function useCurrentHref(
  editor: Editor | null,
  element: 'link' | 'button' | 'image',
): string {
  return useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e) return '';
      if (element === 'button') {
        return (e.getAttributes('button').href as string) ?? '';
      }
      if (element === 'image') {
        return (e.getAttributes('image').href as string) ?? '';
      }
      return (e.getAttributes('link').href as string) ?? '';
    },
  });
}

// --- LinkForm ---

interface LinkFormProps {
  element?: 'link' | 'button' | 'image';
  validateUrl?: (url: string) => string | null | undefined;
  onError?: (message: string) => void;
  onSubmit?: (url: string) => void;
  onUnlink?: () => void;
  className?: string;
  children?: React.ReactNode;
}

function LinkForm({
  element = 'link',
  validateUrl = defaultValidateUrl,
  onError,
  onSubmit,
  onUnlink,
  className,
  children,
}: LinkFormProps) {
  const { editor } = useCurrentEditor();
  const currentHref = useCurrentHref(editor, element);
  const hasLink = currentHref.length > 0;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = React.useState(currentHref);

  React.useEffect(() => {
    setInputValue(currentHref);
  }, [currentHref]);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!editor) return;

      const trimmed = inputValue.trim();

      if (trimmed.length === 0) {
        setHref(editor, element, '');
        onSubmit?.('');
        return;
      }

      const result = validateUrl(trimmed);
      if (result == null) {
        onError?.('Invalid URL');
        return;
      }

      setHref(editor, element, result);
      onSubmit?.(result);
    },
    [editor, element, inputValue, validateUrl, onError, onSubmit],
  );

  const handleUnlink = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!editor) return;
      setHref(editor, element, '');
      setInputValue('');
      onUnlink?.();
    },
    [editor, element, onUnlink],
  );

  if (!editor) {
    return null;
  }

  const contextValue: LinkFormContextValue = {
    inputRef,
    inputValue,
    setInputValue,
    hasLink,
    currentHref,
    handleSubmit,
    handleUnlink,
    element,
  };

  return (
    <LinkFormContext.Provider value={contextValue}>
      <form data-part="link-form" className={className} onSubmit={handleSubmit}>
        {children ?? (
          <>
            <LinkFormInput />
            {hasLink ? <LinkFormUnlink /> : <LinkFormSubmit />}
          </>
        )}
      </form>
    </LinkFormContext.Provider>
  );
}

// --- LinkFormInput ---

interface LinkFormInputProps {
  className?: string;
  placeholder?: string;
}

function LinkFormInput({
  className,
  placeholder = 'Paste a link',
}: LinkFormInputProps) {
  const { inputRef, inputValue, setInputValue } = useLinkFormContext();

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <input
      data-part="link-form-input"
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}

// --- LinkFormSubmit ---

interface LinkFormSubmitProps {
  className?: string;
  children?: React.ReactNode;
}

function LinkFormSubmit({ className, children }: LinkFormSubmitProps) {
  const { hasLink } = useLinkFormContext();

  if (hasLink) {
    return null;
  }

  return (
    <button data-part="link-form-submit" type="submit" className={className}>
      {children ?? <CheckIcon />}
    </button>
  );
}

// --- LinkFormUnlink ---

interface LinkFormUnlinkProps {
  className?: string;
  children?: React.ReactNode;
}

function LinkFormUnlink({ className, children }: LinkFormUnlinkProps) {
  const { hasLink, handleUnlink } = useLinkFormContext();

  if (!hasLink) {
    return null;
  }

  return (
    <button
      data-part="link-form-unlink"
      type="button"
      onClick={handleUnlink}
      className={className}
    >
      {children ?? <UnlinkIcon />}
    </button>
  );
}

export { LinkForm, LinkFormInput, LinkFormSubmit, LinkFormUnlink };
export type {
  LinkFormProps,
  LinkFormInputProps,
  LinkFormSubmitProps,
  LinkFormUnlinkProps,
  LinkFormContextValue,
};
