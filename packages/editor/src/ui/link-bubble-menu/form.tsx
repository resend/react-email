import * as React from 'react';
import {
  focusEditor,
  getUrlFromString,
  setLinkHref,
} from '../bubble-menu/utils';
import { Check, UnlinkIcon } from '../icons';
import { useLinkBubbleMenuContext } from './context';

export interface LinkBubbleMenuFormProps {
  className?: string;
  /** Custom URL validator (default: getUrlFromString) */
  validateUrl?: (value: string) => string | null;
  /** Called after link is applied */
  onLinkApply?: (href: string) => void;
  /** Called after link is removed */
  onLinkRemove?: () => void;
  /** Extra content inside the form (e.g. a variables dropdown slot) */
  children?: React.ReactNode;
}

export function LinkBubbleMenuForm({
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
  children,
}: LinkBubbleMenuFormProps) {
  const { editor, linkHref, isEditing, setIsEditing } =
    useLinkBubbleMenuContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const displayHref = linkHref === '#' ? '' : linkHref;
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
          <Check />
        </button>
      )}
    </form>
  );
}
