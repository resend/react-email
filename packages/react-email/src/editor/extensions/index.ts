import type { Extensions } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import TiptapUnderline from '@tiptap/extension-underline';
import { TrailingNode } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { AlignmentAttribute } from './alignment-attribute';
import { Body } from './body';
import { Bold } from './bold';
import { ClassAttribute } from './class-attribute';
import { CodeBlockPrism } from './code-block';
import { Html } from './custom-html';
import { Div } from './div';
import { Divider } from './divider';
import { DragAndDrop } from './drag-and-drop';
import { EditorButton } from './editor-button';
import { Footer } from './footer';
import { GlobalContent } from './global-content';
import { Heading } from './heading';
import { MaxNesting } from './limit-nested';
import { Link } from './link';
import { placeholder } from './placeholder';
import { PreservedStyle } from './preserved-style';
import { PreviewText } from './preview-text';
import { ResizableImage } from './resizable-image';
import { Section } from './section-node';
import { SocialLinks } from './social-links';
import { StyleAttribute } from './style-attribute';
import { Sup } from './sup';
import { Table, TableCell, TableHeader, TableRow } from './table';
import { EditorTwitter } from './twitter';
import { EditorYouTube } from './youtube';

// MARKER HERE

export const coreExtensions: Extensions = [
  GlobalContent.configure({
    key: 'metadata',
  }),
  StarterKit.configure({
    // The Liveblocks extension comes with its own history handling
    undoRedo: false, // TODO: allow the user to disable this themselves if using liveblocks 
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
  Heading.configure({
    HTMLAttributes: {
      class: 'node-heading',
    },
  }),
  Divider.configure({
    HTMLAttributes: {
      class: 'node-divider',
    },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'node-link',
    },
  }),
  ResizableImage,
  placeholder,
  PreviewText,
  Bold,
  Sup,
  TiptapUnderline,
  TextStyle,
  Color,
  PreservedStyle,
  Highlight.configure({
    multicolor: true,
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: false,
    transformPastedText: true,
  }),
  Footer,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  Body,
  Div,
  Html,
  SocialLinks,
  EditorButton,
  EditorYouTube,
  EditorTwitter,
  TrailingNode,
  Section,
  DragAndDrop,
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
      'link',
    ],
  }),
  MaxNesting.configure({
    maxDepth: 50,
    nodeTypes: ['section', 'bulletList', 'orderedList'],
  }),
];
