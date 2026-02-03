import type { ParentConfig } from '@tiptap/core';
import { mergeAttributes, Node } from '@tiptap/core';
import {
  COMMON_HTML_ATTRIBUTES,
  createStandardAttributes,
  LAYOUT_ATTRIBUTES,
  TABLE_ATTRIBUTES,
  TABLE_CELL_ATTRIBUTES,
  TABLE_HEADER_ATTRIBUTES,
} from './attribute-helpers.js';

declare module '@tiptap/core' {
  interface NodeConfig<Options, Storage> {
    /**
     * A string or function to determine the role of the table.
     * @default 'table'
     * @example () => 'table'
     */
    tableRole?:
      | string
      | ((this: {
          name: string;
          options: Options;
          storage: Storage;
          parent: ParentConfig<NodeConfig<Options>>['tableRole'];
        }) => string);
  }
}

export interface TableOptions {
  HTMLAttributes: Record<string, any>;
}

export const Table = Node.create<TableOptions>({
  name: 'table',

  group: 'block',

  content: 'tableRow+',

  tableRole: 'table',

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...TABLE_ATTRIBUTES,
        ...LAYOUT_ATTRIBUTES,
        ...COMMON_HTML_ATTRIBUTES,
      ]),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'table',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);

    return ['table', attrs, ['tbody', {}, 0]];
  },
});

export const TableRow = Node.create({
  name: 'tableRow',

  group: 'tableRow',

  content: '(tableCell | tableHeader)+',

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...TABLE_CELL_ATTRIBUTES,
        ...LAYOUT_ATTRIBUTES,
        ...COMMON_HTML_ATTRIBUTES,
      ]),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'tr',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['tr', HTMLAttributes, 0];
  },
});

export const TableCell = Node.create({
  name: 'tableCell',

  group: 'tableCell',

  content: 'block+',

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...TABLE_CELL_ATTRIBUTES,
        ...LAYOUT_ATTRIBUTES,
        ...COMMON_HTML_ATTRIBUTES,
      ]),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'td',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['td', HTMLAttributes, 0];
  },
});

export const TableHeader = Node.create({
  name: 'tableHeader',

  group: 'tableCell',

  content: 'block+',

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...TABLE_HEADER_ATTRIBUTES,
        ...TABLE_CELL_ATTRIBUTES,
        ...LAYOUT_ATTRIBUTES,
        ...COMMON_HTML_ATTRIBUTES,
      ]),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'th',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['th', HTMLAttributes, 0];
  },
});
