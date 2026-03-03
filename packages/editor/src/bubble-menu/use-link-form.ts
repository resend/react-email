'use client';

import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { defaultValidateUrl, setHref } from './utils';

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

export { useLinkForm };
export type { UseLinkFormOptions, UseLinkFormReturn };
