import { StarterKit } from '@tiptap/starter-kit';
import { AlignmentAttribute } from './alignment-attribute';
import { Blockquote } from './blockquote';
import { Body } from './body';
import { Bold } from './bold';
import { BulletList } from './bullet-list';
import { Button } from './button';
import { ClassAttribute } from './class-attribute';
import { Code } from './code';
import { CodeBlockPrism } from './code-block';
import { Div } from './div';
import { HardBreak } from './hard-break';
import { Italic } from './italic';
import { ListItem } from './list-item';
import { MaxNesting } from './max-nesting';
import { OrderedList } from './ordered-list';
import { Paragraph } from './paragraph';
import { Placeholder } from './placeholder';
import { PreservedStyle } from './preserved-style';
import { PreviewText } from './preview-text';
import { Section } from './section';
import { Strike } from './strike';
import { StyleAttribute } from './style-attribute';
import { Sup } from './sup';
import { Table, TableCell, TableHeader, TableRow } from './table';
import { Uppercase } from './uppercase';
import { Heading } from './heading';
import { Divider } from './divider';
import { Link } from './link';

export * from './alignment-attribute';
export * from './blockquote';
export * from './body';
export * from './bold';
export * from './bullet-list';
export * from './button';
export * from './class-attribute';
export * from './code';
export * from './code-block';
export * from './columns';
export * from './div';
export * from './hard-break';
export * from './italic';
export * from './list-item';
export * from './max-nesting';
export * from './ordered-list';
export * from './paragraph';
export * from './placeholder';
export * from './preserved-style';
export * from './preview-text';
export * from './section';
export * from './strike';
export * from './style-attribute';
export * from './sup';
export * from './table';
export * from './uppercase';

export const coreExtensions = [
  StarterKit.configure({
    // The Liveblocks extension comes with its own history handling
    undoRedo: false,
    heading: false,
    link: false,
    underline: false,
    trailingNode: false,
    bold: false, // Disable to use our CustomBold that ignores font-weight
    italic: false,
    strike: false,
    code: false,
    paragraph: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
    blockquote: false,
    hardBreak: false,
    gapcursor: false,
    codeBlock: false,
    horizontalRule: false,
    dropcursor: {
      color: '#61a8f8',
      class: 'rounded-full animate-[fade-in_300ms_ease-in-out] !z-40',
      width: 4,
    },
  }),
  CodeBlockPrism.configure({
    defaultLanguage: 'javascript',
    HTMLAttributes: {
      class: 'prism node-codeBlock',
    },
  }),
  Code.configure({
    HTMLAttributes: {
      class: 'node-inlineCode',
      spellcheck: 'false',
    },
  }),
  Paragraph.configure({
    HTMLAttributes: {
      class: 'node-paragraph',
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: 'node-bulletList',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'node-orderedList',
    },
  }),
  Blockquote.configure({
    HTMLAttributes: {
      class: 'node-blockquote',
    },
  }),
  ListItem,
  HardBreak,
  Italic,
  Placeholder,
  PreviewText,
  Bold, // Replaces StarterKit bold, ignores font-weight
  Strike,
  Heading,
  Divider,
  Link,
  Sup,
  Uppercase,
  PreservedStyle,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  Body,
  Div,
  Button,
  Section,
  AlignmentAttribute.configure({
    types: [
      'heading',
      'paragraph',
      'image',
      'blockquote',
      'codeBlock',
      'bulletList',
      'orderedList',
      'listItem',
      'button',
      'youtube',
      'twitter',
      'table',
      'tableRow',
      'tableCell',
      'tableHeader',
      'columnsColumn',
    ],
  }),
  StyleAttribute.configure({
    types: [
      'heading',
      'paragraph',
      'image',
      'blockquote',
      'codeBlock',
      'bulletList',
      'orderedList',
      'listItem',
      'button',
      'youtube',
      'twitter',
      'horizontalRule',
      'footer',
      'section',
      'div',
      'body',
      'table',
      'tableRow',
      'tableCell',
      'tableHeader',
      'columnsColumn',
      'link',
    ],
  }),
  ClassAttribute.configure({
    types: [
      'heading',
      'paragraph',
      'image',
      'blockquote',
      'bulletList',
      'orderedList',
      'listItem',
      'button',
      'youtube',
      'twitter',
      'horizontalRule',
      'footer',
      'section',
      'div',
      'body',
      'table',
      'tableRow',
      'tableCell',
      'tableHeader',
      'columnsColumn',
      'link',
    ],
  }),
  MaxNesting.configure({
    maxDepth: 50,
    nodeTypes: ['section', 'bulletList', 'orderedList'],
  }),
];
