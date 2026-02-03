import type { Extensions } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import TiptapUnderline from '@tiptap/extension-underline';
import StarterKit, { type StarterKitOptions } from '@tiptap/starter-kit';
import { AlignmentAttribute } from './alignment-attribute.js';
import { Body } from './body.js';
import { Bold } from './bold.js';
import { ClassAttribute } from './class-attribute.js';
import { CodeBlockPrism } from './code-block.js';
import { Div } from './div.js';
import { Divider } from './divider.js';
import { DragAndDrop } from './drag-and-drop.js';
import { EditorButton } from './editor-button.js';
import { Heading } from './heading.js';
import { Link } from './link.js';
import { placeholder } from './placeholder.js';
import { PreviewText } from './preview-text.js';
import { ResizableImage } from './resizable-image.js';
import { Section } from './section-node.js';
import { StyleAttribute } from './style-attribute.js';
import { Sup } from './sup.js';

interface Options {
  starterKit?: Partial<StarterKitOptions> | undefined;
}

export function emailTipTapEditorExtensions(options?: Options): Extensions {
  return [
    StarterKit.configure({
      heading: false,
      link: false,
      underline: false,
      trailingNode: false,
      bold: false,
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
      ...options?.starterKit,
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
    Body,
    Div,
    EditorButton,
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
  ];
}
