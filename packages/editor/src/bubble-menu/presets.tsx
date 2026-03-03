'use client';

import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import * as React from 'react';
import { editorEventBus } from '../event-bus';
import {
  AlignCenterButton,
  AlignLeftButton,
  AlignRightButton,
  BoldButton,
  CodeButton,
  ItalicButton,
  StrikeButton,
  UnderlineButton,
  UppercaseButton,
} from './buttons';
import {
  LinkForm,
  LinkFormInput,
  LinkFormSubmit,
  LinkFormUnlink,
} from './link-form';
import {
  NodeSelector,
  NodeSelectorContent,
  NodeSelectorTrigger,
} from './node-selector';

// --- Inline Icons ---

function LinkSvg() {
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
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function RefreshSvg() {
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
    >
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}

function PencilSvg() {
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
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function UnlinkSvg() {
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

function ExternalLinkSvg() {
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
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function PaintBucketSvg() {
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
    >
      <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" />
      <path d="m5 2 5 5" />
      <path d="M2 13h15" />
      <path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z" />
    </svg>
  );
}

// --- TextBubbleMenu ---

interface TextBubbleMenuProps {
  excludeNodes?: string[];
  className?: string;
}

export function TextBubbleMenu({
  excludeNodes = [
    'image',
    'button',
    'htmlContent',
    'socialLinks',
    'youtube',
    'twitter',
  ],
  className,
}: TextBubbleMenuProps) {
  const { editor } = useCurrentEditor();
  const [isLinkFormOpen, setIsLinkFormOpen] = React.useState(false);

  React.useEffect(() => {
    const subscription = editorEventBus.on('add-link', () => {
      setIsLinkFormOpen(true);
    });
    return () => {
      setIsLinkFormOpen(false);
      subscription.unsubscribe();
    };
  }, []);

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed, view }) => {
        for (const node of excludeNodes) {
          if (ed.isActive(node)) return false;
        }
        if (view.dom.classList.contains('dragging')) return false;
        return ed.view.state.selection.content().size > 0;
      }}
      options={{
        placement: 'bottom',
        offset: 8,
        onHide: () => {
          setIsLinkFormOpen(false);
        },
      }}
      className={className}
      data-part="bubble-menu-root"
    >
      <div data-part="bubble-menu-root">
        <NodeSelector>
          <NodeSelectorTrigger />
          <NodeSelectorContent />
        </NodeSelector>

        <BubbleMenuSeparatorInternal />

        {!isLinkFormOpen ? (
          <button
            data-part="bubble-menu-button"
            aria-label="Add link"
            type="button"
            onClick={() => setIsLinkFormOpen(true)}
          >
            <LinkSvg />
          </button>
        ) : (
          <LinkForm
            onSubmit={() => setIsLinkFormOpen(false)}
            onError={() => setIsLinkFormOpen(false)}
          >
            <LinkFormInput />
            <LinkFormSubmit />
            <LinkFormUnlink />
          </LinkForm>
        )}

        <BubbleMenuSeparatorInternal />

        <div data-part="bubble-menu-group">
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <StrikeButton />
          <CodeButton />
          <UppercaseButton />
        </div>

        <BubbleMenuSeparatorInternal />

        <div data-part="bubble-menu-group">
          <AlignLeftButton />
          <AlignCenterButton />
          <AlignRightButton />
        </div>
      </div>
    </BubbleMenu>
  );
}

// --- LinkBubbleMenu ---

interface LinkBubbleMenuProps {
  className?: string;
}

export function LinkBubbleMenu({ className }: LinkBubbleMenuProps) {
  const { editor } = useCurrentEditor();
  const [isEditing, setIsEditing] = React.useState(false);

  const linkHref = useEditorState({
    editor,
    selector: ({ editor: ed }) => ed?.getAttributes('link').href ?? '',
  });

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed }) =>
        ed.isActive('link') && ed.view.state.selection.content().size === 0
      }
      options={{
        onHide: () => setIsEditing(false),
      }}
      className={className}
      data-part="bubble-menu-root"
    >
      <div data-part="bubble-menu-root">
        {!isEditing ? (
          <div data-part="bubble-menu-group">
            <button
              data-part="bubble-menu-button"
              aria-label="Edit link"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              <PencilSvg />
            </button>
            <button
              data-part="bubble-menu-button"
              aria-label="Remove link"
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <UnlinkSvg />
            </button>
            <a
              data-part="bubble-menu-button"
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open link"
            >
              <ExternalLinkSvg />
            </a>
          </div>
        ) : (
          <LinkForm onSubmit={() => setIsEditing(false)}>
            <LinkFormInput />
            <LinkFormSubmit />
            <LinkFormUnlink />
          </LinkForm>
        )}
      </div>
    </BubbleMenu>
  );
}

// --- ImageBubbleMenu ---

interface ImageBubbleMenuProps {
  onReplaceImage?: (
    editor: ReturnType<typeof useCurrentEditor>['editor'],
  ) => void;
  className?: string;
}

export function ImageBubbleMenu({
  onReplaceImage,
  className,
}: ImageBubbleMenuProps) {
  const { editor } = useCurrentEditor();
  const [isLinkFormOpen, setIsLinkFormOpen] = React.useState(false);

  if (!editor) return null;

  const handleReplace = () => {
    if (onReplaceImage) {
      onReplaceImage(editor);
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files?.length) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed, view }) =>
        ed.isActive('image') && !view.dom.classList.contains('dragging')
      }
      options={{
        onHide: () => setIsLinkFormOpen(false),
      }}
      className={className}
      data-part="bubble-menu-root"
    >
      <div data-part="bubble-menu-root">
        {!isLinkFormOpen ? (
          <div data-part="bubble-menu-group">
            <button
              data-part="bubble-menu-button"
              aria-label="Replace image"
              type="button"
              onClick={handleReplace}
            >
              <RefreshSvg />
            </button>
            <button
              data-part="bubble-menu-button"
              aria-label="Add link"
              type="button"
              onClick={() => setIsLinkFormOpen(true)}
            >
              <LinkSvg />
            </button>
          </div>
        ) : (
          <LinkForm element="image" onSubmit={() => setIsLinkFormOpen(false)}>
            <LinkFormInput />
            <LinkFormSubmit />
            <LinkFormUnlink />
          </LinkForm>
        )}
      </div>
    </BubbleMenu>
  );
}

// --- ButtonBubbleMenu ---

interface ButtonBubbleMenuProps {
  className?: string;
}

export function ButtonBubbleMenu({ className }: ButtonBubbleMenuProps) {
  const { editor } = useCurrentEditor();
  const [isLinkFormOpen, setIsLinkFormOpen] = React.useState(false);

  if (!editor) return null;

  const handleStyle = () => {
    const { selection } = editor.state;
    const { $from } = selection;
    let buttonPos: number | null = null;

    for (let depth = $from.depth; depth > 0; depth -= 1) {
      if ($from.node(depth).type.name === 'button') {
        buttonPos = $from.before(depth);
        break;
      }
    }

    setTimeout(() => {
      const { doc } = editor.state;
      const resolvedButtonPos =
        buttonPos !== null && doc.nodeAt(buttonPos) ? buttonPos : null;

      if (resolvedButtonPos === null) {
        editor.commands.focus();
        return;
      }

      try {
        editor.commands.setNodeSelection(resolvedButtonPos);
        editor.commands.focus();
      } catch {
        editor.commands.focus();
      }
    }, 0);
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed, view }) =>
        ed.isActive('button') && !view.dom.classList.contains('dragging')
      }
      options={{
        onHide: () => setIsLinkFormOpen(false),
      }}
      className={className}
      data-part="bubble-menu-root"
    >
      <div data-part="bubble-menu-root">
        {!isLinkFormOpen ? (
          <div data-part="bubble-menu-group">
            <button
              data-part="bubble-menu-button"
              aria-label="Edit link"
              type="button"
              onClick={() => setIsLinkFormOpen(true)}
            >
              <LinkSvg />
            </button>
            <button
              data-part="bubble-menu-button"
              aria-label="Open style mode"
              type="button"
              onClick={handleStyle}
            >
              <PaintBucketSvg />
            </button>
          </div>
        ) : (
          <LinkForm element="button" onSubmit={() => setIsLinkFormOpen(false)}>
            <LinkFormInput />
            <LinkFormSubmit />
            <LinkFormUnlink />
          </LinkForm>
        )}
      </div>
    </BubbleMenu>
  );
}

// --- Internal separator helper ---

function BubbleMenuSeparatorInternal() {
  return <hr data-part="bubble-menu-separator" />;
}
