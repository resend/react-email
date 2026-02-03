import type { Editor, Range } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import {
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered,
  MousePointer,
  RadioIcon,
  RefreshCcwIcon,
  Rows2Icon,
  Split,
  SplitSquareVerticalIcon,
  SquareCode,
  Text as TextIcon,
  TextQuote,
  UserMinus,
  VariableIcon,
  Youtube,
} from 'lucide-react';
import * as React from 'react';
import type {
  GetReferenceClientRect,
  Instance as TippyInstance,
} from 'tippy.js';
import tippy from 'tippy.js';
import { cn } from '@/lib/cn';
import { IconTwitter } from '@/ui/icons/icon-twitter';
import { dropdown } from '@/ui/shared';
import { Text } from '@/ui/text';
// TODO: Extensions layer imports from plugins layer.
// This is acceptable since extensions/ is allowed to use plugins/,
// but consider moving useAgnosticSelf to a shared location if needed elsewhere.
import { useAgnosticSelf } from '../plugins/collaboration/liveblocks';
import { startImageUpload } from './upload-image';

interface CommandItemProps {
  title: string;
  description: string;
  icon:
    | typeof Code2
    | React.FC<React.SVGProps<SVGSVGElement> & { size?: number }>;
  category: 'Text' | 'Media' | 'Layout' | 'Utility';
  searchTerms?: string[];
  command: (props: CommandProps) => void;
}

interface CommandProps {
  editor: Editor;
  range: Range;
  userId?: string;
}

const Command = Extension.create({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: CommandItemProps;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

/*
 * Available Commands
 */

const TEXT: CommandItemProps = {
  title: 'Text',
  description: 'Just start typing with plain text.',
  searchTerms: ['p', 'paragraph'],
  icon: TextIcon,
  category: 'Text',
  command: ({ editor, range }: CommandProps) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .toggleNode('paragraph', 'paragraph')
      .run();
  },
};

const IMAGE: CommandItemProps = {
  title: 'Image',
  description: 'Upload an image from your computer.',
  searchTerms: ['photo', 'picture', 'media'],
  icon: ImageIcon,
  category: 'Media',
  command: ({ editor, range }: CommandProps) => {
    editor.chain().focus().deleteRange(range).run();
    // upload image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const pos = editor.view.state.selection.from;
        const CURRENT_POSITION_OFFSET = 1;

        startImageUpload(
          file,
          editor.view,
          pos - CURRENT_POSITION_OFFSET,
          undefined,
          editor.storage.metadata,
        );
      }
    };
    input.click();
  },
};

const H1: CommandItemProps = {
  title: 'Heading 1',
  description: 'Big heading.',
  searchTerms: ['title', 'big', 'large', 'h1'],
  icon: Heading1,
  category: 'Text',
  command: ({ editor, range }: CommandProps) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 1 })
      .run();
  },
};

const H2: CommandItemProps = {
  title: 'Heading 2',
  description: 'Medium heading.',
  searchTerms: ['subtitle', 'medium', 'h2'],
  icon: Heading2,
  category: 'Text',
  command: ({ editor, range }: CommandProps) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 2 })
      .run();
  },
};

const H3: CommandItemProps = {
  title: 'Heading 3',
  description: 'Small heading.',
  searchTerms: ['subtitle', 'small', 'h3'],
  icon: Heading3,
  category: 'Text',
  command: ({ editor, range }: CommandProps) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 3 })
      .run();
  },
};

const BULLET_LIST: CommandItemProps = {
  title: 'Bullet List',
  description: 'Create a simple bullet list.',
  searchTerms: ['unordered', 'point'],
  icon: List,
  category: 'Text',
  command: ({ editor, range }: CommandProps) => {
    editor.chain().focus().deleteRange(range).toggleBulletList().run();
  },
};

const NUMBERED_LIST: CommandItemProps = {
  title: 'Numbered List',
  description: 'Create a list with numbering.',
  searchTerms: ['ordered'],
  icon: ListOrdered,
  category: 'Text',
  command: ({ editor, range }: CommandProps) => {
    editor.chain().focus().deleteRange(range).toggleOrderedList().run();
  },
};

const BUTTON: CommandItemProps = {
  title: 'Button',
  description: 'Add a button link',
  searchTerms: ['button'],
  icon: MousePointer,
  category: 'Layout',
  command: ({ editor, range }: CommandProps) =>
    editor.chain().focus().deleteRange(range).setButton().run(),
};

const DIVIDER: CommandItemProps = {
  title: 'Divider',
  description: 'Add a horizontal rule.',
  searchTerms: ['hr', 'divider', 'separator'],
  icon: SplitSquareVerticalIcon,
  category: 'Layout',
  command: ({ editor, range }: CommandProps) =>
    editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
};

const HTML: CommandItemProps = {
  title: 'HTML',
  description: 'Insert any custom code',
  searchTerms: ['html'],
  icon: Code2,
  category: 'Utility',
  command: ({ editor, range, userId }: CommandProps) =>
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertHtml(userId ?? '')
      .run(),
};

const YOUTUBE: CommandItemProps = {
  title: 'YouTube',
  description: 'Embed a YouTube thumbnail',
  searchTerms: ['youtube', 'video', 'embed'],
  icon: Youtube,
  category: 'Media',
  command: ({ editor, range, userId }: CommandProps) =>
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertYouTube(userId ?? '')
      .run(),
};

const TWITTER: CommandItemProps = {
  title: 'X (former Twitter)',
  description: 'Embed a X (Twitter) post',
  searchTerms: ['twitter', 'x', 'tweet', 'post'],
  icon: IconTwitter,
  category: 'Media',
  command: ({ editor, range, userId }: CommandProps) =>
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertTweet(userId ?? '')
      .run(),
};

const QUOTE: CommandItemProps = {
  title: 'Quote',
  description: 'Capture a quote.',
  searchTerms: ['blockquote'],
  icon: TextQuote,
  category: 'Text',
  command: ({ editor, range }: CommandProps) =>
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .toggleNode('paragraph', 'paragraph')
      .toggleBlockquote()
      .run(),
};

const SECTION: CommandItemProps = {
  title: 'Section',
  description: 'Add a section container',
  searchTerms: ['section', 'row', 'container'],
  icon: Rows2Icon,
  category: 'Layout',
  command: ({ editor, range }: CommandProps) =>
    editor.chain().focus().deleteRange(range).insertSection().run(),
};

const CODE: CommandItemProps = {
  title: 'Code Block',
  description: 'Capture a code snippet.',
  searchTerms: ['codeblock'],
  icon: SquareCode,
  category: 'Text',
  command: ({ editor, range }: CommandProps) =>
    editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
};

const SOCIAL_LINKS: CommandItemProps = {
  title: 'Social Links',
  description: 'LinkedIn, X, Discord, Slack, etc.',
  searchTerms: ['social', 'links'],
  icon: RadioIcon,
  category: 'Layout',
  command: ({ editor, range, userId }: CommandProps) =>
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertSocialLinks(userId ?? '')
      .run(),
};

const UNSUBSCRIBE_FOOTER: CommandItemProps = {
  title: 'Unsubscribe Footer',
  description: 'Add unsubscribe',
  searchTerms: ['footer', 'unsubscribe'],
  icon: UserMinus,
  category: 'Layout',
  command: ({ editor, range }: CommandProps) =>
    editor.chain().focus().deleteRange(range).insertFooter().run(),
};

const VARIABLE: CommandItemProps = {
  title: 'Variable',
  description: 'Add dynamic value',
  searchTerms: ['variable', 'data', 'metadata'],
  icon: VariableIcon,
  category: 'Utility',
  command: ({ editor, range }: CommandProps) =>
    editor.chain().focus().deleteRange(range).insertContent('{{').run(),
};

const isInsideNode = (editor: Editor, type: string) => {
  const { $from } = editor.state.selection;
  for (let d = $from.depth; d > 0; d--) {
    if ($from.node(d).type.name === type) {
      return true;
    }
  }
  return false;
};

const EACH_LOOP: CommandItemProps = {
  title: 'Each Loop',
  description: 'Iterate over a collection',
  searchTerms: ['for', 'each', 'loop', 'iterate', 'repeat', 'list'],
  icon: RefreshCcwIcon,
  category: 'Utility',
  command: ({ editor, range }: CommandProps) => {
    if (isInsideNode(editor, 'loop')) {
      return;
    }

    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({
        type: 'loop',
        attrs: {
          list: '',
        },
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Content inside loop',
              },
            ],
          },
        ],
      })
      .run();
  },
};

const CONDITIONAL: CommandItemProps = {
  title: 'Conditional',
  description: 'Show content based on a condition',
  searchTerms: ['if', 'unless', 'conditional', 'show', 'hide'],
  icon: Split,
  category: 'Utility',
  command: ({ editor, range }: CommandProps) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({
        type: 'conditional',
        attrs: {
          test: '',
          negate: false,
        },
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Content inside conditional',
              },
            ],
          },
        ],
      })
      .run();
  },
};

const defaultSuggestionItems: CommandItemProps[] = [
  TEXT,
  H1,
  H2,
  H3,
  BULLET_LIST,
  NUMBERED_LIST,
  QUOTE,
  CODE,
  IMAGE,
  YOUTUBE,
  TWITTER,
  BUTTON,
  DIVIDER,
  SECTION,
  SOCIAL_LINKS,
  UNSUBSCRIBE_FOOTER,
  HTML,
  VARIABLE,
];

const getSuggestionItems = ({
  query,
  items = defaultSuggestionItems,
  editor,
}: {
  query: string;
  items?: CommandItemProps[];
  editor?: Editor;
}) => {
  const filteredItems =
    editor && isInsideNode(editor, 'loop')
      ? items.filter((item) => item.title !== 'Each Loop')
      : items;

  if (!query || query.length === 0) {
    return filteredItems;
  }

  return filteredItems.filter((item) => {
    const search = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.searchTerms?.some((term: string) =>
        term.toLowerCase().includes(search),
      )
    );
  });
};

const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

const CommandList = ({
  items,
  command,
  editor,
}: {
  items: CommandItemProps[];
  command: (item: CommandItemProps) => void;
  editor: Editor;
  range: Range;
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const currentUser = useAgnosticSelf();

  const selectItem = React.useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        command({
          ...item,
          command: (props: CommandProps) =>
            item.command({ ...props, userId: currentUser?.id ?? 'unknown' }),
        });
      }
    },
    [command, editor, items, currentUser?.id],
  );

  React.useEffect(() => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const container = commandListContainer?.current;
    const selectedButton = container?.querySelector(
      'button[data-selected="true"]',
    ) as HTMLElement;
    if (selectedButton && container) {
      updateScrollView(container, selectedButton);
    }
  }, [selectedIndex]);

  if (items.length === 0) {
    return null;
  }

  const groupedItems = [
    { title: 'Text', items: items.filter((item) => item.category === 'Text') },
    {
      title: 'Media',
      items: items.filter((item) => item.category === 'Media'),
    },
    {
      title: 'Layout',
      items: items.filter((item) => item.category === 'Layout'),
    },
    {
      title: 'Utility',
      items: items.filter((item) => item.category === 'Utility'),
    },
  ].filter((group) => group.items.length > 0);

  const itemIndexMap = new Map(items.map((item, index) => [item, index]));

  return (
    <div
      className={cn(
        'h-auto max-h-[330px] w-64 overflow-hidden',
        dropdown.content.appearance,
        dropdown.content.sizing,
        'p-0',
      )}
      id="slash-command"
    >
      <div
        className="overflow-y-auto py-1 flex flex-col gap-1"
        ref={commandListContainer}
      >
        {groupedItems.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <Text size="1" className={cn(dropdown.label, 'pl-3.5 pt-1')} as="p">
              {group.title}
            </Text>
            {group.items.map((item, itemIndex) => {
              const globalIndex = itemIndexMap.get(item) ?? -1;
              return (
                <button
                  key={`${groupIndex}-${itemIndex}`}
                  className={cn(
                    'flex items-center gap-2',
                    dropdown.item.appearance.gray,
                    dropdown.item.sizing,
                  )}
                  data-selected={globalIndex === selectedIndex}
                  onClick={() => selectItem(globalIndex)}
                >
                  <div className="fill-test flex h-9 w-5 items-center justify-center rounded-md">
                    <item.icon
                      className="invert dark:invert-0"
                      size={20}
                      stroke="url(#resend-dark-gradient)"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                  </div>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: TippyInstance[] | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      const { selection } = props.editor.state;

      const parentNode = selection.$from.node(selection.$from.depth);
      const blockType = parentNode.type.name;

      if (blockType === 'codeBlock') {
        return false;
      }

      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      // @ts-expect-error
      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      popup?.[0].setProps({
        getReferenceClientRect:
          props.clientRect as unknown as GetReferenceClientRect,
      });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === 'Escape') {
        popup?.[0].hide();

        return true;
      }

      // @ts-expect-error
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

const createSlashCommand = (
  items: CommandItemProps[] = defaultSuggestionItems,
) => {
  return Command.configure({
    suggestion: {
      items: (context: { query: string; editor: Editor }) =>
        getSuggestionItems({
          query: context.query,
          items,
          editor: context.editor,
        }),
      render: renderItems,
    },
  });
};

/*
 * Default slash editor
 */
export const SlashCommand = createSlashCommand();

/**
 * Slash used in the template editor
 */
export const SlashCommandTemplate = createSlashCommand([
  ...defaultSuggestionItems,
  CONDITIONAL,
  EACH_LOOP,
]);

/*
 * Slash used in the public marketing page editor
 */
const miniEditorSuggestions = [
  ...defaultSuggestionItems,
  {
    title: 'Image Upload',
    description: 'Upload an image from your computer.',
    searchTerms: ['photo', 'picture', 'media'],
    icon: ImageIcon,
    category: 'Media' as const,
    command: ({ editor, range }: CommandProps) => {
      editor.chain().focus().deleteRange(range).run();
      // add a default image node
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            src: 'https://resend.com/static/handbook/how-we-think-about-swag-1.jpg',
            alt: 'Placeholder image',
          },
        })
        .run();
    },
  },
  {
    title: 'YouTube Videos',
    description: 'Embed a YouTube thumbnail',
    searchTerms: ['youtube', 'video', 'embed'],
    icon: Youtube,
    category: 'Media' as const,
    command: ({ editor, range }: CommandProps) => {
      editor.chain().focus().deleteRange(range).run();
      // add a default image node
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            src: 'https://resend-attachments.s3.amazonaws.com/Fj6gdISmbhby3Vs',
            alt: 'Placeholder image',
          },
        })
        .run();
    },
  },
  {
    title: 'X Posts',
    description: 'Embed a X (Twitter) post',
    searchTerms: ['twitter', 'x', 'tweet', 'post'],
    icon: IconTwitter,
    category: 'Media' as const,
    command: ({ editor, range }: CommandProps) => {
      editor.chain().focus().deleteRange(range).run();
      // add a default image node
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            src: 'https://resend-attachments.s3.amazonaws.com/bmeBVJ3UOU75W5h',
            alt: 'Placeholder image',
          },
        })
        .run();
    },
  },
].filter(
  (item) =>
    !['HTML', 'Image', 'YouTube', 'X (former Twitter)'].includes(item.title),
);

export const SlashCommandMini = createSlashCommand(miniEditorSuggestions);
