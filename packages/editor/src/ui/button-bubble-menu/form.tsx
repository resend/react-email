import { Check, UnlinkIcon } from '../icons';
import * as React from 'react';
import { focusEditor, getUrlFromString } from '../bubble-menu/utils';
import { useButtonBubbleMenuContext } from './context';

export interface ButtonBubbleMenuFormProps {
  className?: string;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
}

export function ButtonBubbleMenuForm({
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
}: ButtonBubbleMenuFormProps) {
  const { editor, buttonHref, isEditing, setIsEditing } =
    useButtonBubbleMenuContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const displayHref = buttonHref === '#' ? '' : buttonHref;
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
      editor.commands.updateButton({ href: '#' });
      setIsEditing(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    const validate = validateUrl ?? getUrlFromString;
    const finalValue = validate(value);

    if (!finalValue) {
      editor.commands.updateButton({ href: '#' });
      setIsEditing(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    editor.commands.updateButton({ href: finalValue });
    setIsEditing(false);
    focusEditor(editor);
    onLinkApply?.(finalValue);
  }

  function handleUnlink(e: React.MouseEvent) {
    e.stopPropagation();
    editor.commands.updateButton({ href: '#' });
    setIsEditing(false);
    focusEditor(editor);
    onLinkRemove?.();
  }

  return (
    <form
      ref={formRef}
      data-re-btn-bm-form=""
      className={className}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        data-re-btn-bm-input=""
        value={inputValue}
        onFocus={(e) => e.stopPropagation()}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Paste a link"
        type="text"
      />

      {displayHref ? (
        <button
          type="button"
          aria-label="Remove link"
          data-re-btn-bm-unlink=""
          onClick={handleUnlink}
        >
          <UnlinkIcon />
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Apply link"
          data-re-btn-bm-apply=""
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Check />
        </button>
      )}
    </form>
  );
}
