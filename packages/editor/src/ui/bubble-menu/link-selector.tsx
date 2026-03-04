import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { Check, LinkIcon, UnlinkIcon } from 'lucide-react';
import * as React from 'react';
import { editorEventBus } from '../../core/event-bus';
import { useBubbleMenuContext } from './context';
import { focusEditor, getUrlFromString, setLinkHref } from './utils';

export interface BubbleMenuLinkSelectorProps {
  className?: string;
  /** Whether to show the link icon toggle button (default: true) */
  showToggle?: boolean;
  /** Custom URL validator. Return the valid URL string or null. */
  validateUrl?: (value: string) => string | null;
  /** Called after link is applied */
  onLinkApply?: (href: string) => void;
  /** Called after link is removed */
  onLinkRemove?: () => void;
  /** Plugin slot: extra actions rendered inside the link input form */
  children?: React.ReactNode;
}

export function BubbleMenuLinkSelector({
  className,
  showToggle = true,
  validateUrl,
  onLinkApply,
  onLinkRemove,
  children,
}: BubbleMenuLinkSelectorProps) {
  const { editor } = useBubbleMenuContext();
  const [isOpen, setIsOpen] = React.useState(false);

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isLinkActive: editor?.isActive('link') ?? false,
      hasLink: Boolean(editor?.getAttributes('link').href),
      currentHref: (editor?.getAttributes('link').href as string) || '',
    }),
  });

  React.useEffect(() => {
    const subscription = editorEventBus.on('bubble-menu:add-link', () => {
      setIsOpen(true);
    });

    return () => {
      setIsOpen(false);
      subscription.unsubscribe();
    };
  }, []);

  if (!editorState) {
    return null;
  }

  const handleOpenLink = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      data-re-link-selector=""
      {...(isOpen ? { 'data-open': '' } : {})}
      {...(editorState.hasLink ? { 'data-has-link': '' } : {})}
      className={className}
    >
      {showToggle && (
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="Add link"
          aria-pressed={editorState.isLinkActive && editorState.hasLink}
          data-re-link-selector-trigger=""
          onClick={handleOpenLink}
        >
          <LinkIcon />
        </button>
      )}
      {isOpen && (
        <LinkForm
          editor={editor}
          currentHref={editorState.currentHref}
          validateUrl={validateUrl}
          onLinkApply={onLinkApply}
          onLinkRemove={onLinkRemove}
          setIsOpen={setIsOpen}
        >
          {children}
        </LinkForm>
      )}
    </div>
  );
}

interface LinkFormProps {
  editor: Editor;
  currentHref: string;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
  setIsOpen: (state: boolean) => void;
  children?: React.ReactNode;
}

function LinkForm({
  editor,
  currentHref,
  validateUrl,
  onLinkApply,
  onLinkRemove,
  setIsOpen,
  children,
}: LinkFormProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const displayHref = currentHref === '#' ? '' : currentHref;
  const [inputValue, setInputValue] = React.useState(displayHref);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (editor.getAttributes('link').href === '#') {
          editor.chain().unsetLink().run();
        }
        setIsOpen(false);
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
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editor, setIsOpen]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = inputValue.trim();

    if (value === '') {
      setLinkHref(editor, '');
      setIsOpen(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    const validate = validateUrl ?? getUrlFromString;
    const finalValue = validate(value);

    if (!finalValue) {
      setLinkHref(editor, '');
      setIsOpen(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    setLinkHref(editor, finalValue);
    setIsOpen(false);
    focusEditor(editor);
    onLinkApply?.(finalValue);
  }

  function handleUnlink(e: React.MouseEvent) {
    e.stopPropagation();
    setLinkHref(editor, '');
    setIsOpen(false);
    focusEditor(editor);
    onLinkRemove?.();
  }

  return (
    <form
      ref={formRef}
      data-re-link-selector-form=""
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        data-re-link-selector-input=""
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
          data-re-link-selector-unlink=""
          onClick={handleUnlink}
        >
          <UnlinkIcon />
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Apply link"
          data-re-link-selector-apply=""
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Check />
        </button>
      )}
    </form>
  );
}
