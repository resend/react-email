import { useEditorState } from '@tiptap/react';
import * as React from 'react';
import { CheckIcon, UnlinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';
import { focusEditor, getUrlFromString, setLinkHref } from './utils';

export interface BubbleMenuLinkFormProps {
  className?: string;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
  children?: React.ReactNode;
}

export function BubbleMenuLinkForm({
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
  children,
}: BubbleMenuLinkFormProps) {
  const { editor, isEditing, setIsEditing } = useBubbleMenuContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const linkHref = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      (e?.getAttributes('link').href as string) ?? '',
  });

  const displayHref = (linkHref ?? '') === '#' ? '' : (linkHref ?? '');
  const [inputValue, setInputValue] = React.useState(displayHref);

  React.useEffect(() => {
    if (!isEditing) {
      return;
    }
    setInputValue(displayHref);
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [isEditing, displayHref]);

  React.useEffect(() => {
    if (!isEditing) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const form = formRef.current;
        const submitEvent = new Event('submit', {
          bubbles: true,
          cancelable: true,
        });
        form.dispatchEvent(submitEvent);
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, setIsEditing]);

  if (!isEditing) {
    return null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = inputValue.trim();

    if (value === '') {
      setLinkHref(editor, '');
      setIsEditing(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    const validate = validateUrl ?? getUrlFromString;
    const finalValue = validate(value);

    if (!finalValue) {
      setLinkHref(editor, '');
      setIsEditing(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    setLinkHref(editor, finalValue);
    setIsEditing(false);
    focusEditor(editor);
    onLinkApply?.(finalValue);
  }

  function handleUnlink(e: React.MouseEvent) {
    e.stopPropagation();
    setLinkHref(editor, '');
    setIsEditing(false);
    focusEditor(editor);
    onLinkRemove?.();
  }

  return (
    <form
      ref={formRef}
      data-re-link-bm-form=""
      className={className}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        data-re-link-bm-input=""
        value={inputValue}
        onFocus={(e) => e.stopPropagation()}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Paste a link"
        type="text"
      />

      {children}

      {displayHref ? (
        <button
          type="button"
          aria-label="Remove link"
          data-re-link-bm-unlink=""
          onClick={handleUnlink}
        >
          <UnlinkIcon />
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Apply link"
          data-re-link-bm-apply=""
          onMouseDown={(e) => e.stopPropagation()}
        >
          <CheckIcon />
        </button>
      )}
    </form>
  );
}
