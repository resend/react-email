'use client';

import type { Editor } from '@tiptap/core';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { Check, UnlinkIcon } from 'lucide-react';
import * as React from 'react';

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
      {children ?? <Check />}
    </button>
  );
}

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
