import type { Extensions } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import TiptapUnderline from '@tiptap/extension-underline';
import { TrailingNode } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { editorEventBus } from '../core/event-bus';
import { AlignmentAttribute } from './alignment-attribute';
import { ClassAttribute } from './class-attribute';
import { CodeBlockPrism } from './code-block';
import { Divider } from './divider';
import { DragAndDrop } from './drag-and-drop';
import { EditorButton } from './editor-button';
import { Footer } from './footer';
import { Heading } from './heading';
import { Section } from './section-node';
import { SlashCommandMini } from './slash-command';
import { SocialLinks } from './social-links';
import { StyleAttribute } from './style-attribute';
import { EditorYouTube } from './youtube';

export interface MiniExtensionsOptions {
  /** Plugin extensions to inject (e.g., Variable) */
  pluginExtensions?: Extensions;
}

/**
 * Mini extension set used in the marketing page editor.
 * This is a lighter version of the full editor extensions.
 */
export const coreMiniExtensions = ({
  pluginExtensions = [],
}: MiniExtensionsOptions = {}): Extensions => [
  StarterKit.configure({
    heading: false,
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
      width: 3,
    },
  }),
  CodeBlockPrism.configure({
    defaultLanguage: 'javascript',
    HTMLAttributes: {
      class: 'prism',
    },
  }),
  Heading,
  Divider,
  TiptapLink.extend({
    addAttributes() {
      return {
        ...this.parent?.(),

        'ses:no-track': {
          default: null,
          parseHTML: (element) => element.getAttribute('ses:no-track'),
        },
      };
    },
    addKeyboardShortcuts() {
      return {
        'Mod-k': () => {
          editorEventBus.dispatch('add-link', undefined);
          // unselect
          return this.editor.chain().focus().toggleLink({ href: '' }).run();
        },
      };
    },
  }).configure({
    openOnClick: false,
  }),
  // Inject plugin extensions (e.g., Variable)
  ...pluginExtensions,
  TiptapImage.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        width: {
          default: '100%',
        },
        height: {
          default: null,
        },
        alignment: {
          default: 'left',
        },
        href: {
          default: '',
        },
      };
    },
  }).configure({
    allowBase64: true,
    inline: false,
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return `Heading ${node.attrs.level}`;
      }
      return "Press '/' for commands";
    },
    includeChildren: true,
  }),
  SlashCommandMini,
  TiptapUnderline,
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: false,
    transformPastedText: true,
  }),
  Footer,
  SocialLinks,
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
      'horizontalRule',
      'footer',
      'section',
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
      'horizontalRule',
      'footer',
      'section',
    ],
  }),
];
