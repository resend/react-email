import { StarterKit } from '@tiptap/starter-kit';
import { AlignmentAttribute } from './alignment-attribute';
import { Body } from './body';
import { Bold } from './bold';
import { Button } from './button';
import { ClassAttribute } from './class-attribute';
import { CodeBlockPrism } from './code-block';
import { Div } from './div';
import { MaxNesting } from './max-nesting';
import { Placeholder } from './placeholder';
import { PreservedStyle } from './preserved-style';
import { PreviewText } from './preview-text';
import { Section } from './section';
import { StyleAttribute } from './style-attribute';
import { Sup } from './sup';
import { Uppercase } from './uppercase';
import { Table, TableCell, TableHeader, TableRow } from './table';

export * from './alignment-attribute';
export * from './body';
export * from './bold';
export * from './button';
export * from './class-attribute';
export * from './code-block';
export * from './columns';
export * from './div';
export * from './max-nesting';
export * from './placeholder';
export * from './preserved-style';
export * from './preview-text';
export * from './section';
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
    gapcursor: false,
    listItem: {},
    bulletList: {
      HTMLAttributes: {
        class: 'node-bulletList',
      },
    },
    paragraph: {
      HTMLAttributes: {
        class: 'node-paragraph',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: 'node-orderedList',
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: 'node-blockquote',
      },
    },
    codeBlock: false,
    code: {
      HTMLAttributes: {
        class: 'node-inlineCode',
        spellcheck: 'false',
      },
    },
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
  Placeholder,
  PreviewText,
  Bold, // Replaces StarterKit bold, ignores font-weight
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
