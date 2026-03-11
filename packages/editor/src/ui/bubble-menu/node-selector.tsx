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
import { useBubbleMenuContext } from './context.js';

export type NodeType =
  | 'Text'
  | 'Title'
  | 'Subtitle'
  | 'Heading'
  | 'Bullet List'
  | 'Numbered List'
  | 'Quote'
  | 'Code';

export interface NodeSelectorItem {
  name: NodeType;
  icon: React.ComponentType<React.SVGAttributes<SVGSVGElement>>;
  command: () => void;
  isActive: boolean;
}

interface NodeSelectorContextValue {
  items: NodeSelectorItem[];
  activeItem: NodeSelectorItem | { name: 'Multiple' };
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const NodeSelectorContext =
  React.createContext<NodeSelectorContextValue | null>(null);

function useNodeSelectorContext(): NodeSelectorContextValue {
  const context = React.useContext(NodeSelectorContext);
  if (!context) {
    throw new Error(
      'NodeSelector compound components must be used within <NodeSelector.Root>',
    );
  }
  return context;
}

export interface NodeSelectorRootProps {
  /** Block types to exclude */
  omit?: string[];
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
}

export function NodeSelectorRoot({
  omit = [],
  open: controlledOpen,
  onOpenChange,
  className,
  children,
}: NodeSelectorRootProps) {
  const { editor } = useBubbleMenuContext();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const setIsOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

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

  const allItems: NodeSelectorItem[] = React.useMemo(
    () => [
      {
        name: 'Text' as const,
        icon: TextIcon,
        command: () =>
          editor
            .chain()
            .focus()
            .clearNodes()
            .toggleNode('paragraph', 'paragraph')
            .run(),
        isActive: editorState?.isParagraphActive ?? false,
      },
      {
        name: 'Title' as const,
        icon: Heading1,
        command: () =>
          editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
        isActive: editorState?.isHeading1Active ?? false,
      },
      {
        name: 'Subtitle' as const,
        icon: Heading2,
        command: () =>
          editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
        isActive: editorState?.isHeading2Active ?? false,
      },
      {
        name: 'Heading' as const,
        icon: Heading3,
        command: () =>
          editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
        isActive: editorState?.isHeading3Active ?? false,
      },
      {
        name: 'Bullet List' as const,
        icon: List,
        command: () =>
          editor.chain().focus().clearNodes().toggleBulletList().run(),
        isActive: editorState?.isBulletListActive ?? false,
      },
      {
        name: 'Numbered List' as const,
        icon: ListOrdered,
        command: () =>
          editor.chain().focus().clearNodes().toggleOrderedList().run(),
        isActive: editorState?.isOrderedListActive ?? false,
      },
      {
        name: 'Quote' as const,
        icon: TextQuote,
        command: () =>
          editor
            .chain()
            .focus()
            .clearNodes()
            .toggleNode('paragraph', 'paragraph')
            .toggleBlockquote()
            .run(),
        isActive: editorState?.isBlockquoteActive ?? false,
      },
      {
        name: 'Code' as const,
        icon: Code,
        command: () =>
          editor.chain().focus().clearNodes().toggleCodeBlock().run(),
        isActive: editorState?.isCodeBlockActive ?? false,
      },
    ],
    [editor, editorState],
  );

  const items = React.useMemo(
    () => allItems.filter((item) => !omit.includes(item.name)),
    [allItems, omit],
  );

  const activeItem = React.useMemo(
    () =>
      items.find((item) => item.isActive) ?? {
        name: 'Multiple' as const,
      },
    [items],
  );

  const contextValue = React.useMemo(
    () => ({ items, activeItem, isOpen, setIsOpen }),
    [items, activeItem, isOpen, setIsOpen],
  );

  if (!editorState || items.length === 0) {
    return null;
  }

  return (
    <NodeSelectorContext.Provider value={contextValue}>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <div
          data-re-node-selector=""
          {...(isOpen ? { 'data-open': '' } : {})}
          className={className}
        >
          {children}
        </div>
      </Popover.Root>
    </NodeSelectorContext.Provider>
  );
}

export interface NodeSelectorTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

export function NodeSelectorTrigger({
  className,
  children,
}: NodeSelectorTriggerProps) {
  const { activeItem, isOpen, setIsOpen } = useNodeSelectorContext();

  return (
    <Popover.Trigger
      data-re-node-selector-trigger=""
      className={className}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children ?? (
        <>
          <span>{activeItem.name}</span>
          <ChevronDown />
        </>
      )}
    </Popover.Trigger>
  );
}

export interface NodeSelectorContentProps {
  className?: string;
  /** Popover alignment (default: "start") */
  align?: 'start' | 'center' | 'end';
  /** Render-prop for full control over item rendering.
   *  Receives the filtered items and a `close` function to dismiss the popover. */
  children?: (items: NodeSelectorItem[], close: () => void) => React.ReactNode;
}

export function NodeSelectorContent({
  className,
  align = 'start',
  children,
}: NodeSelectorContentProps) {
  const { items, setIsOpen } = useNodeSelectorContext();

  return (
    <Popover.Content
      align={align}
      data-re-node-selector-content=""
      className={className}
    >
      {children
        ? children(items, () => setIsOpen(false))
        : items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                type="button"
                data-re-node-selector-item=""
                {...(item.isActive ? { 'data-active': '' } : {})}
                onClick={() => {
                  item.command();
                  setIsOpen(false);
                }}
              >
                <Icon />
                <span>{item.name}</span>
                {item.isActive && <Check />}
              </button>
            );
          })}
    </Popover.Content>
  );
}

export interface BubbleMenuNodeSelectorProps {
  /** Block types to exclude */
  omit?: string[];
  className?: string;
  /** Override the trigger content (default: active item name + chevron icon) */
  triggerContent?: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export function BubbleMenuNodeSelector({
  omit = [],
  className,
  triggerContent,
  open,
  onOpenChange,
}: BubbleMenuNodeSelectorProps) {
  return (
    <NodeSelectorRoot
      omit={omit}
      open={open}
      onOpenChange={onOpenChange}
      className={className}
    >
      <NodeSelectorTrigger>{triggerContent}</NodeSelectorTrigger>
      <NodeSelectorContent />
    </NodeSelectorRoot>
  );
}
