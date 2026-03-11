import { StarterKit } from '@tiptap/starter-kit';
import { AlignmentAttribute } from './alignment-attribute.js';
import { Body } from './body.js';
import { Bold } from './bold.js';
import { Button } from './button.js';
import { ClassAttribute } from './class-attribute.js';
import { CodeBlockPrism } from './code-block.js';
import { Div } from './div.js';
import { MaxNesting } from './max-nesting.js';
import { Placeholder } from './placeholder.js';
import { PreservedStyle } from './preserved-style.js';
import { PreviewText } from './preview-text.js';
import { Section } from './section.js';
import { StyleAttribute } from './style-attribute.js';
import { Sup } from './sup.js';
import { Table, TableCell, TableHeader, TableRow } from './table.js';
import { Uppercase } from './uppercase.js';

export * from './alignment-attribute.js';
export * from './body.js';
export * from './bold.js';
export * from './button.js';
export * from './class-attribute.js';
export * from './code-block.js';
export * from './columns.js';
export * from './div.js';
export * from './max-nesting.js';
export * from './placeholder.js';
export * from './preserved-style.js';
export * from './preview-text.js';
export * from './section.js';
export * from './style-attribute.js';
export * from './sup.js';
export * from './table.js';
export * from './uppercase.js';

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
