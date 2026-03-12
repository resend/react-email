import { type AnyExtension, Extension } from '@tiptap/core';
import TipTapStarterKit from '@tiptap/starter-kit';
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

type ExtensionOptions<T extends AnyExtension> = T extends {
  configure: (options?: infer O) => AnyExtension;
}
  ? O
  : never;

type StarterKitExtensionOption<T extends AnyExtension> =
  | ExtensionOptions<T>
  | false;

const alignmentTypes = [
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
] as const;

const styleTypes = [
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
] as const;

const classTypes = [
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
] as const;

const tipTapStarterKitDefaults: ExtensionOptions<typeof TipTapStarterKit> = {
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
};

export interface StarterKitOptions {
  tiptapStarterKit: StarterKitExtensionOption<typeof TipTapStarterKit>;
  codeBlock: StarterKitExtensionOption<typeof CodeBlockPrism>;
  code: StarterKitExtensionOption<typeof Code>;
  paragraph: StarterKitExtensionOption<typeof Paragraph>;
  bulletList: StarterKitExtensionOption<typeof BulletList>;
  orderedList: StarterKitExtensionOption<typeof OrderedList>;
  blockquote: StarterKitExtensionOption<typeof Blockquote>;
  listItem: StarterKitExtensionOption<typeof ListItem>;
  hardBreak: StarterKitExtensionOption<typeof HardBreak>;
  italic: StarterKitExtensionOption<typeof Italic>;
  placeholder: StarterKitExtensionOption<typeof Placeholder>;
  previewText: StarterKitExtensionOption<typeof PreviewText>;
  bold: StarterKitExtensionOption<typeof Bold>;
  strike: StarterKitExtensionOption<typeof Strike>;
  heading: StarterKitExtensionOption<typeof Heading>;
  divider: StarterKitExtensionOption<typeof Divider>;
  link: StarterKitExtensionOption<typeof Link>;
  sup: StarterKitExtensionOption<typeof Sup>;
  uppercase: StarterKitExtensionOption<typeof Uppercase>;
  preservedStyle: StarterKitExtensionOption<typeof PreservedStyle>;
  table: StarterKitExtensionOption<typeof Table>;
  tableRow: StarterKitExtensionOption<typeof TableRow>;
  tableCell: StarterKitExtensionOption<typeof TableCell>;
  tableHeader: StarterKitExtensionOption<typeof TableHeader>;
  body: StarterKitExtensionOption<typeof Body>;
  div: StarterKitExtensionOption<typeof Div>;
  button: StarterKitExtensionOption<typeof Button>;
  section: StarterKitExtensionOption<typeof Section>;
  alignmentAttribute: StarterKitExtensionOption<typeof AlignmentAttribute>;
  styleAttribute: StarterKitExtensionOption<typeof StyleAttribute>;
  classAttribute: StarterKitExtensionOption<typeof ClassAttribute>;
  maxNesting: StarterKitExtensionOption<typeof MaxNesting>;
}

function pushConfiguredExtension<T extends AnyExtension>(
  extensions: AnyExtension[],
  extension: T,
  options: StarterKitExtensionOption<T>,
) {
  if (options === false) {
    return;
  }
  extensions.push(extension.configure(options as ExtensionOptions<T>));
}

export const StarterKit = Extension.create<StarterKitOptions>({
  name: 'reactEmailStarterKit',

  addOptions() {
    return {
      tiptapStarterKit: tipTapStarterKitDefaults,
      codeBlock: {
        defaultLanguage: 'javascript',
        HTMLAttributes: {
          class: 'prism node-codeBlock',
        },
      },
      code: {
        HTMLAttributes: {
          class: 'node-inlineCode',
          spellcheck: 'false',
        },
      },
      paragraph: {
        HTMLAttributes: {
          class: 'node-paragraph',
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: 'node-bulletList',
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
      listItem: {},
      hardBreak: {},
      italic: {},
      placeholder: {},
      previewText: {},
      bold: {},
      strike: {},
      heading: {},
      divider: {},
      link: {},
      sup: {},
      uppercase: {},
      preservedStyle: {},
      table: {},
      tableRow: {},
      tableCell: {},
      tableHeader: {},
      body: {},
      div: {},
      button: {},
      section: {},
      alignmentAttribute: {
        types: [...alignmentTypes],
      },
      styleAttribute: {
        types: [...styleTypes],
      },
      classAttribute: {
        types: [...classTypes],
      },
      maxNesting: {
        maxDepth: 50,
        nodeTypes: ['section', 'bulletList', 'orderedList'],
      },
    };
  },

  addExtensions() {
    const extensions: AnyExtension[] = [];

    if (this.options.tiptapStarterKit !== false) {
      extensions.push(
        TipTapStarterKit.configure({
          ...tipTapStarterKitDefaults,
          ...this.options.tiptapStarterKit,
        }),
      );
    }

    pushConfiguredExtension(extensions, CodeBlockPrism, this.options.codeBlock);
    pushConfiguredExtension(extensions, Code, this.options.code);
    pushConfiguredExtension(extensions, Paragraph, this.options.paragraph);
    pushConfiguredExtension(extensions, BulletList, this.options.bulletList);
    pushConfiguredExtension(extensions, OrderedList, this.options.orderedList);
    pushConfiguredExtension(extensions, Blockquote, this.options.blockquote);
    pushConfiguredExtension(extensions, ListItem, this.options.listItem);
    pushConfiguredExtension(extensions, HardBreak, this.options.hardBreak);
    pushConfiguredExtension(extensions, Italic, this.options.italic);
    pushConfiguredExtension(extensions, Placeholder, this.options.placeholder);
    pushConfiguredExtension(extensions, PreviewText, this.options.previewText);
    pushConfiguredExtension(extensions, Bold, this.options.bold);
    pushConfiguredExtension(extensions, Strike, this.options.strike);
    pushConfiguredExtension(extensions, Heading, this.options.heading);
    pushConfiguredExtension(extensions, Divider, this.options.divider);
    pushConfiguredExtension(extensions, Link, this.options.link);
    pushConfiguredExtension(extensions, Sup, this.options.sup);
    pushConfiguredExtension(extensions, Uppercase, this.options.uppercase);
    pushConfiguredExtension(
      extensions,
      PreservedStyle,
      this.options.preservedStyle,
    );
    pushConfiguredExtension(extensions, Table, this.options.table);
    pushConfiguredExtension(extensions, TableRow, this.options.tableRow);
    pushConfiguredExtension(extensions, TableCell, this.options.tableCell);
    pushConfiguredExtension(extensions, TableHeader, this.options.tableHeader);
    pushConfiguredExtension(extensions, Body, this.options.body);
    pushConfiguredExtension(extensions, Div, this.options.div);
    pushConfiguredExtension(extensions, Button, this.options.button);
    pushConfiguredExtension(extensions, Section, this.options.section);
    pushConfiguredExtension(
      extensions,
      AlignmentAttribute,
      this.options.alignmentAttribute,
    );
    pushConfiguredExtension(
      extensions,
      StyleAttribute,
      this.options.styleAttribute,
    );
    pushConfiguredExtension(
      extensions,
      ClassAttribute,
      this.options.classAttribute,
    );
    pushConfiguredExtension(extensions, MaxNesting, this.options.maxNesting);

    return extensions;
  },
});

