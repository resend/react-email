import { type AnyExtension, Extension } from '@tiptap/core';
import type { BlockquoteOptions } from '@tiptap/extension-blockquote';
import type { BulletListOptions } from '@tiptap/extension-bullet-list';
import type { CodeOptions } from '@tiptap/extension-code';
import type { HardBreakOptions } from '@tiptap/extension-hard-break';
import type { ItalicOptions } from '@tiptap/extension-italic';
import type { ListItemOptions } from '@tiptap/extension-list-item';
import type { OrderedListOptions } from '@tiptap/extension-ordered-list';
import type { ParagraphOptions } from '@tiptap/extension-paragraph';
import type { StrikeOptions } from '@tiptap/extension-strike';
import { UndoRedo, type UndoRedoOptions } from '@tiptap/extensions';
import TipTapStarterKit, {
  type StarterKitOptions as TipTapStarterKitOptions,
} from '@tiptap/starter-kit';
import type { AlignmentOptions } from './alignment-attribute';
import { AlignmentAttribute } from './alignment-attribute';
import { Blockquote } from './blockquote';
import type { BodyOptions } from './body';
import { Body } from './body';
import type { BoldOptions } from './bold';
import { Bold } from './bold';
import { BulletList } from './bullet-list';
import type { EditorButtonOptions } from './button';
import { Button } from './button';
import type { ClassAttributeOptions } from './class-attribute';
import { ClassAttribute } from './class-attribute';
import { Code } from './code';
import type { CodeBlockPrismOptions } from './code-block';
import { CodeBlockPrism } from './code-block';
import {
  ColumnsColumn,
  FourColumns,
  ThreeColumns,
  TwoColumns,
} from './columns';
import type { ContainerOptions } from './container';
import { Container } from './container';
import type { DivOptions } from './div';
import { Div } from './div';
import type { DividerOptions } from './divider';
import { Divider } from './divider';
import type { GlobalContentOptions } from './global-content';
import { GlobalContent } from './global-content';
import { HardBreak } from './hard-break';
import type { HeadingOptions } from './heading';
import { Heading } from './heading';
import { Italic } from './italic';
import type { LinkOptions } from './link';
import { Link } from './link';
import { ListItem } from './list-item';
import type { MaxNestingOptions } from './max-nesting';
import { MaxNesting } from './max-nesting';
import { OrderedList } from './ordered-list';
import { Paragraph } from './paragraph';
import type { PlaceholderOptions } from './placeholder';
import { Placeholder } from './placeholder';
import { PreservedStyle } from './preserved-style';
import type { PreviewTextOptions } from './preview-text';
import { PreviewText } from './preview-text';
import type { SectionOptions } from './section';
import { Section } from './section';
import { Strike } from './strike';
import type { StyleAttributeOptions } from './style-attribute';
import { StyleAttribute } from './style-attribute';
import type { SupOptions } from './sup';
import { Sup } from './sup';
import type { TableCellOptions, TableOptions, TableRowOptions } from './table';
import { Table, TableCell, TableHeader, TableRow } from './table';
import { Text } from './text';
import { TrailingNode, type TrailingNodeOptions } from './trailing-node';
import type { UnderlineOptions } from './underline';
import { Underline } from './underline';
import type { UppercaseOptions } from './uppercase';
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
export * from './container';
export * from './div';
export * from './divider';
export * from './global-content';
export * from './hard-break';
export * from './heading';
export * from './italic';
export * from './link';
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
export * from './text';
export * from './trailing-node';
export * from './underline';
export * from './uppercase';

const starterKitExtensions: Record<string, AnyExtension> = {
  CodeBlockPrism,
  Code,
  TwoColumns,
  ThreeColumns,
  FourColumns,
  Container,
  ColumnsColumn,
  Paragraph,
  BulletList,
  OrderedList,
  Blockquote,
  ListItem,
  HardBreak,
  Italic,
  Placeholder,
  PreviewText,
  TrailingNode,
  Bold,
  Strike,
  Heading,
  Divider,
  Link,
  Sup,
  Underline,
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
  Text,
  AlignmentAttribute,
  StyleAttribute,
  ClassAttribute,
  MaxNesting,
  UndoRedo,
};

export type StarterKitOptions = {
  CodeBlockPrism: Partial<CodeBlockPrismOptions> | false;
  Code: Partial<CodeOptions> | false;
  TwoColumns: Partial<Record<string, never>> | false;
  ThreeColumns: Partial<Record<string, never>> | false;
  FourColumns: Partial<Record<string, never>> | false;
  ColumnsColumn: Partial<Record<string, never>> | false;
  Paragraph: Partial<ParagraphOptions> | false;
  BulletList: Partial<BulletListOptions> | false;
  OrderedList: Partial<OrderedListOptions> | false;
  TrailingNode: Partial<TrailingNodeOptions> | false;
  Blockquote: Partial<BlockquoteOptions> | false;
  ListItem: Partial<ListItemOptions> | false;
  HardBreak: Partial<HardBreakOptions> | false;
  Italic: Partial<ItalicOptions> | false;
  Placeholder: Partial<PlaceholderOptions> | false;
  PreviewText: Partial<PreviewTextOptions> | false;
  Bold: Partial<BoldOptions> | false;
  Strike: Partial<StrikeOptions> | false;
  Heading: Partial<HeadingOptions> | false;
  Divider: Partial<DividerOptions> | false;
  Link: Partial<LinkOptions> | false;
  Sup: Partial<SupOptions> | false;
  Underline: Partial<UnderlineOptions> | false;
  Uppercase: Partial<UppercaseOptions> | false;
  PreservedStyle: Partial<Record<string, never>> | false;
  Table: Partial<TableOptions> | false;
  TableRow: Partial<TableRowOptions> | false;
  TableCell: Partial<TableCellOptions> | false;
  TableHeader: Partial<Record<string, any>> | false;
  Body: Partial<BodyOptions> | false;
  Container: Partial<ContainerOptions> | false;
  Div: Partial<DivOptions> | false;
  Text: Record<string, never> | false;
  Button: Partial<EditorButtonOptions> | false;
  Section: Partial<SectionOptions> | false;
  GlobalContent: Partial<GlobalContentOptions> | false;
  AlignmentAttribute: Partial<AlignmentOptions> | false;
  StyleAttribute: Partial<StyleAttributeOptions> | false;
  ClassAttribute: Partial<ClassAttributeOptions> | false;
  MaxNesting: Partial<MaxNestingOptions> | false;
  UndoRedo: Partial<UndoRedoOptions> | false;
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
      TrailingNode: {
        node: 'paragraph',
        appendTo: 'container',
      },
      Code: {
        HTMLAttributes: {
          class: 'node-inlineCode',
          spellcheck: 'false',
        },
      },
      TwoColumns: {},
      ThreeColumns: {},
      FourColumns: {},
      ColumnsColumn: {},
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
      Link: { openOnClick: false, HTMLAttributes: { class: 'node-link' } },
      Sup: {},
      Underline: {},
      Uppercase: {},
      PreservedStyle: {},
      Table: {},
      TableRow: {},
      TableCell: {},
      TableHeader: {},
      Body: {},
      Container: {},
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
      Text: {},
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
      UndoRedo: {},
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
          text: false,
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
      const key = name as keyof StarterKitOptions;
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
