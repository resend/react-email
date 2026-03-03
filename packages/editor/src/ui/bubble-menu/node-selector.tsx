import * as Popover from '@radix-ui/react-popover';
import { useEditorState } from '@tiptap/react';
import {
  Check,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  TextIcon,
  TextQuote,
} from 'lucide-react';
import * as React from 'react';
import { useBubbleMenuContext } from './context';

type NodeType =
  | 'Text'
  | 'Title'
  | 'Subtitle'
  | 'Heading'
  | 'Bullet List'
  | 'Numbered List'
  | 'Quote'
  | 'Code';

interface NodeItem {
  name: NodeType;
  icon: React.ComponentType<{ className?: string }>;
  command: () => void;
  isActive: () => boolean;
}

export interface BubbleMenuNodeSelectorProps {
  /** Block types to exclude */
  omit?: string[];
  className?: string;
  /** Override the trigger content (default: active item name + chevron icon) */
  triggerContent?: React.ReactNode;
}

export function BubbleMenuNodeSelector({
  omit = [],
  className,
  triggerContent,
}: BubbleMenuNodeSelectorProps) {
  const { editor } = useBubbleMenuContext();
  const [isOpen, setIsOpen] = React.useState(false);

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isParagraphActive:
        (editor?.isActive('paragraph') ?? false) &&
        !editor?.isActive('bulletList') &&
        !editor?.isActive('orderedList'),
      isHeading1Active: editor?.isActive('heading', { level: 1 }) ?? false,
      isHeading2Active: editor?.isActive('heading', { level: 2 }) ?? false,
      isHeading3Active: editor?.isActive('heading', { level: 3 }) ?? false,
      isBulletListActive: editor?.isActive('bulletList') ?? false,
      isOrderedListActive: editor?.isActive('orderedList') ?? false,
      isBlockquoteActive: editor?.isActive('blockquote') ?? false,
      isCodeBlockActive: editor?.isActive('codeBlock') ?? false,
    }),
  });

  if (!editorState) {
    return null;
  }

  const items: NodeItem[] = [
    {
      name: 'Text',
      icon: TextIcon,
      command: () =>
        editor
          .chain()
          .focus()
          .clearNodes()
          .toggleNode('paragraph', 'paragraph')
          .run(),
      isActive: () => editorState.isParagraphActive,
    },
    {
      name: 'Title',
      icon: Heading1,
      command: () =>
        editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
      isActive: () => editorState.isHeading1Active,
    },
    {
      name: 'Subtitle',
      icon: Heading2,
      command: () =>
        editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
      isActive: () => editorState.isHeading2Active,
    },
    {
      name: 'Heading',
      icon: Heading3,
      command: () =>
        editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
      isActive: () => editorState.isHeading3Active,
    },
    {
      name: 'Bullet List',
      icon: List,
      command: () =>
        editor.chain().focus().clearNodes().toggleBulletList().run(),
      isActive: () => editorState.isBulletListActive,
    },
    {
      name: 'Numbered List',
      icon: ListOrdered,
      command: () =>
        editor.chain().focus().clearNodes().toggleOrderedList().run(),
      isActive: () => editorState.isOrderedListActive,
    },
    {
      name: 'Quote',
      icon: TextQuote,
      command: () =>
        editor
          .chain()
          .focus()
          .clearNodes()
          .toggleNode('paragraph', 'paragraph')
          .toggleBlockquote()
          .run(),
      isActive: () => editorState.isBlockquoteActive,
    },
    {
      name: 'Code',
      icon: Code,
      command: () =>
        editor.chain().focus().clearNodes().toggleCodeBlock().run(),
      isActive: () => editorState.isCodeBlockActive,
    },
  ];

  const filteredItems = items.filter((item) => !omit.includes(item.name));

  if (filteredItems.length === 0) {
    return null;
  }

  const activeItem = filteredItems.find((item) => item.isActive()) ?? {
    name: 'Multiple',
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <div
        data-re-node-selector=""
        {...(isOpen ? { 'data-open': '' } : {})}
        className={className}
      >
        <Popover.Trigger
          data-re-node-selector-trigger=""
          onClick={() => setIsOpen(!isOpen)}
        >
          {triggerContent ?? (
            <>
              <span>{activeItem.name}</span>
              <ChevronDown />
            </>
          )}
        </Popover.Trigger>

        <Popover.Content align="start" data-re-node-selector-content="">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive();
            return (
              <button
                key={item.name}
                type="button"
                data-re-node-selector-item=""
                {...(active ? { 'data-active': '' } : {})}
                onClick={() => {
                  item.command();
                  setIsOpen(false);
                }}
              >
                <Icon />
                <span>{item.name}</span>
                {active && <Check />}
              </button>
            );
          })}
        </Popover.Content>
      </div>
    </Popover.Root>
  );
}
