import { type AnyExtension, type Extendable, Extension } from '@tiptap/core';
import TipTapStarterKit, {
  type StarterKitOptions as TipTapStarterKitOptions,
} from '@tiptap/starter-kit';
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
import { Divider } from './divider';
import { GlobalContent } from './global-content';
import { HardBreak } from './hard-break';
import { Heading } from './heading';
import { Italic } from './italic';
import { Link } from './link';
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
export * from './global-content';
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

type StarterKitExtensionMap = typeof starterKitExtensions;

const starterKitExtensions = {
  CodeBlockPrism,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  Blockquote,
  ListItem,
  HardBreak,
  Italic,
  Placeholder,
  PreviewText,
  Bold,
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
  GlobalContent,
  AlignmentAttribute,
  StyleAttribute,
  ClassAttribute,
  MaxNesting,
};

export type StarterKitOptions = {
  [Key in keyof StarterKitExtensionMap]: StarterKitExtensionMap[Key] extends Extendable<
    infer Options
  >
    ? Partial<Options> | false
    : never;
} & {
  TiptapStarterKit: Partial<TipTapStarterKitOptions> | false;
};

export const StarterKit = Extension.create<StarterKitOptions>({
  name: 'reactEmailStarterKit',

  addOptions() {
    return {
      TiptapStarterKit: {},
      CodeBlockPrism: {
        defaultLanguage: 'javascript',
        HTMLAttributes: {
          class: 'prism node-codeBlock',
        },
      },
      Code: {
        HTMLAttributes: {
          class: 'node-inlineCode',
          spellcheck: 'false',
        },
      },
      Paragraph: {
        HTMLAttributes: {
          class: 'node-paragraph',
        },
      },
      BulletList: {
        HTMLAttributes: {
          class: 'node-bulletList',
        },
      },
      OrderedList: {
        HTMLAttributes: {
          class: 'node-orderedList',
        },
      },
      Blockquote: {
        HTMLAttributes: {
          class: 'node-blockquote',
        },
      },
      ListItem: {},
      HardBreak: {},
      Italic: {},
      Placeholder: {},
      PreviewText: {},
      Bold: {},
      Strike: {},
      Heading: {},
      Divider: {},
      Link: {},
      Sup: {},
      Uppercase: {},
      PreservedStyle: {},
      Table: {},
      TableRow: {},
      TableCell: {},
      TableHeader: {},
      Body: {},
      Div: {},
      Button: {},
      Section: {},
      GlobalContent: {},
      AlignmentAttribute: {
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
      },
      StyleAttribute: {
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
      },
      ClassAttribute: {
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
      },
      MaxNesting: {
        maxDepth: 50,
        nodeTypes: ['section', 'bulletList', 'orderedList'],
      },
    };
  },

  addExtensions() {
    const extensions: AnyExtension[] = [];

    if (this.options.TiptapStarterKit !== false) {
      extensions.push(
        TipTapStarterKit.configure({
          // Collaboration extensions handle history separately.
          undoRedo: false,
          heading: false,
          link: false,
          underline: false,
          trailingNode: false,
          bold: false,
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
          ...this.options.TiptapStarterKit,
        }),
      );
    }

    for (const [name, extension] of Object.entries(starterKitExtensions)) {
      const key = name as keyof StarterKitExtensionMap;
      const extensionOptions = this.options[key];
      if (extensionOptions !== false) {
        extensions.push(
          (extension as AnyExtension).configure(extensionOptions),
        );
      }
    }

    return extensions;
  },
});
