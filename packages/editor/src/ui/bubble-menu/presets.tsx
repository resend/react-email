'use client';

import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  ExternalLinkIcon,
  LinkIcon,
  PaintBucketIcon,
  PencilIcon,
  RefreshCwIcon,
  UnlinkIcon,
} from 'lucide-react';
import * as React from 'react';
import { editorEventBus } from '../../event-bus';
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
            <LinkIcon />
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
              <PencilIcon />
            </button>
            <button
              data-part="bubble-menu-button"
              aria-label="Remove link"
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <UnlinkIcon />
            </button>
            <a
              data-part="bubble-menu-button"
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open link"
            >
              <ExternalLinkIcon />
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
              <RefreshCwIcon />
            </button>
            <button
              data-part="bubble-menu-button"
              aria-label="Add link"
              type="button"
              onClick={() => setIsLinkFormOpen(true)}
            >
              <LinkIcon />
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
              <LinkIcon />
            </button>
            <button
              data-part="bubble-menu-button"
              aria-label="Open style mode"
              type="button"
              onClick={handleStyle}
            >
              <PaintBucketIcon />
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

function BubbleMenuSeparatorInternal() {
  return <hr data-part="bubble-menu-separator" />;
}
