import { useEditorState } from '@tiptap/react';
import * as React from 'react';
import { CheckIcon, UnlinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';
import { focusEditor, getUrlFromString } from './utils';

export interface BubbleMenuImageFormProps {
  className?: string;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
}

export function BubbleMenuImageForm({
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
}: BubbleMenuImageFormProps) {
  const { editor, isEditing, setIsEditing } = useBubbleMenuContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const imageHref = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      (e?.getAttributes('image').href as string | null) ?? '',
  });

  const [inputValue, setInputValue] = React.useState(imageHref ?? '');

  React.useEffect(() => {
    if (!isEditing) {
      return;
    }
    setInputValue(imageHref ?? '');
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [isEditing, imageHref]);

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
      editor.chain().focus().updateAttributes('image', { href: null }).run();
      setIsEditing(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    const validate = validateUrl ?? getUrlFromString;
    const finalValue = validate(value);

    if (!finalValue) {
      editor.chain().focus().updateAttributes('image', { href: null }).run();
      setIsEditing(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    editor
      .chain()
      .focus()
      .updateAttributes('image', { href: finalValue })
      .run();
    setIsEditing(false);
    focusEditor(editor);
    onLinkApply?.(finalValue);
  }

  function handleUnlink(e: React.MouseEvent) {
    e.stopPropagation();
    editor.chain().focus().updateAttributes('image', { href: null }).run();
    setIsEditing(false);
    focusEditor(editor);
    onLinkRemove?.();
  }

  const hasLink = (imageHref ?? '') !== '';

  return (
    <form
      ref={formRef}
      data-re-img-bm-form=""
      className={className}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        data-re-img-bm-input=""
        value={inputValue}
        onFocus={(e) => e.stopPropagation()}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Paste a link"
        type="text"
      />

      {hasLink ? (
        <button
          type="button"
          aria-label="Remove link"
          data-re-img-bm-unlink=""
          onClick={handleUnlink}
        >
          <UnlinkIcon />
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Apply link"
          data-re-img-bm-apply=""
          onMouseDown={(e) => e.stopPropagation()}
        >
          <CheckIcon />
        </button>
      )}
    </form>
  );
}
