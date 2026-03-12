import {
  Columns2,
  Columns3,
  Columns4,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  MousePointer,
  Rows2 as Rows2Icon,
  SplitSquareVertical as SplitSquareVerticalIcon,
  SquareCode,
  Text,
  TextQuote,
} from 'lucide-react';
import type { SlashCommandItem } from './types';

export const TEXT: SlashCommandItem = {
  title: 'Text',
  description: 'Plain text block',
  icon: <Text size={20} />,
  category: 'Text',
  searchTerms: ['p', 'paragraph'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .toggleNode('paragraph', 'paragraph')
      .run();
  },
};

export const H1: SlashCommandItem = {
  title: 'Title',
  description: 'Large heading',
  icon: <Heading1 size={20} />,
  category: 'Text',
  searchTerms: ['title', 'big', 'large', 'h1'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 1 })
      .run();
  },
};

export const H2: SlashCommandItem = {
  title: 'Subtitle',
  description: 'Medium heading',
  icon: <Heading2 size={20} />,
  category: 'Text',
  searchTerms: ['subtitle', 'medium', 'h2'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 2 })
      .run();
  },
};

export const H3: SlashCommandItem = {
  title: 'Heading',
  description: 'Small heading',
  icon: <Heading3 size={20} />,
  category: 'Text',
  searchTerms: ['subtitle', 'small', 'h3'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 3 })
      .run();
  },
};

export const BULLET_LIST: SlashCommandItem = {
  title: 'Bullet list',
  description: 'Unordered list',
  icon: <List size={20} />,
  category: 'Text',
  searchTerms: ['unordered', 'point'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleBulletList().run();
  },
};

export const NUMBERED_LIST: SlashCommandItem = {
  title: 'Numbered list',
  description: 'Ordered list',
  icon: <ListOrdered size={20} />,
  category: 'Text',
  searchTerms: ['ordered'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleOrderedList().run();
  },
};

export const QUOTE: SlashCommandItem = {
  title: 'Quote',
  description: 'Block quote',
  icon: <TextQuote size={20} />,
  category: 'Text',
  searchTerms: ['blockquote'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .toggleNode('paragraph', 'paragraph')
      .toggleBlockquote()
      .run();
  },
};

export const CODE: SlashCommandItem = {
  title: 'Code block',
  description: 'Code snippet',
  icon: <SquareCode size={20} />,
  category: 'Text',
  searchTerms: ['codeblock'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
  },
};

export const BUTTON: SlashCommandItem = {
  title: 'Button',
  description: 'Clickable button',
  icon: <MousePointer size={20} />,
  category: 'Layout',
  searchTerms: ['button'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setButton().run();
  },
};

export const DIVIDER: SlashCommandItem = {
  title: 'Divider',
  description: 'Horizontal separator',
  icon: <SplitSquareVerticalIcon size={20} />,
  category: 'Layout',
  searchTerms: ['hr', 'divider', 'separator'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setHorizontalRule().run();
  },
};

export const SECTION: SlashCommandItem = {
  title: 'Section',
  description: 'Content section',
  icon: <Rows2Icon size={20} />,
  category: 'Layout',
  searchTerms: ['section', 'row', 'container'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).insertSection().run();
  },
};

export const TWO_COLUMNS: SlashCommandItem = {
  title: '2 columns',
  description: 'Two column layout',
  icon: <Columns2 size={20} />,
  category: 'Layout',
  searchTerms: [
    'columns',
    'column',
    'layout',
    'grid',
    'split',
    'side-by-side',
    'multi-column',
    'row',
    'two',
    '2',
  ],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).insertColumns(2).run();
  },
};

export const THREE_COLUMNS: SlashCommandItem = {
  title: '3 columns',
  description: 'Three column layout',
  icon: <Columns3 size={20} />,
  category: 'Layout',
  searchTerms: [
    'columns',
    'column',
    'layout',
    'grid',
    'split',
    'multi-column',
    'row',
    'three',
    '3',
  ],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).insertColumns(3).run();
  },
};

export const FOUR_COLUMNS: SlashCommandItem = {
  title: '4 columns',
  description: 'Four column layout',
  icon: <Columns4 size={20} />,
  category: 'Layout',
  searchTerms: [
    'columns',
    'column',
    'layout',
    'grid',
    'split',
    'multi-column',
    'row',
    'four',
    '4',
  ],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).insertColumns(4).run();
  },
};

export const defaultSlashCommands: SlashCommandItem[] = [
  TEXT,
  H1,
  H2,
  H3,
  BULLET_LIST,
  NUMBERED_LIST,
  QUOTE,
  CODE,
  BUTTON,
  DIVIDER,
  SECTION,
  TWO_COLUMNS,
  THREE_COLUMNS,
  FOUR_COLUMNS,
];
