import { Column, Row } from '@react-email/components';
import { type CommandProps, mergeAttributes, Node } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';
import {
  COMMON_HTML_ATTRIBUTES,
  createStandardAttributes,
  LAYOUT_ATTRIBUTES,
} from '../utils/attribute-helpers';
import { inlineCssToJs } from '../utils/styles';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      insertColumns: (count: 2 | 3 | 4) => ReturnType;
    };
  }
}

export const COLUMN_PARENT_TYPES = [
  'twoColumns',
  'threeColumns',
  'fourColumns',
] as const;

const COLUMN_PARENT_SET = new Set<string>(COLUMN_PARENT_TYPES);

export const MAX_COLUMNS_DEPTH = 3;

export function getColumnsDepth(doc: ProseMirrorNode, from: number): number {
  const $from = doc.resolve(from);
  let depth = 0;
  for (let d = $from.depth; d > 0; d--) {
    if (COLUMN_PARENT_SET.has($from.node(d).type.name)) {
      depth++;
    }
  }
  return depth;
}

interface ColumnsVariantConfig {
  name: (typeof COLUMN_PARENT_TYPES)[number];
  columnCount: number;
  content: string;
  dataType: string;
}

const VARIANTS: ColumnsVariantConfig[] = [
  {
    name: 'twoColumns',
    columnCount: 2,
    content: 'columnsColumn columnsColumn',
    dataType: 'two-columns',
  },
  {
    name: 'threeColumns',
    columnCount: 3,
    content: 'columnsColumn columnsColumn columnsColumn',
    dataType: 'three-columns',
  },
  {
    name: 'fourColumns',
    columnCount: 4,
    content: 'columnsColumn{4}',
    dataType: 'four-columns',
  },
];

const NODE_TYPE_MAP: Record<number, (typeof COLUMN_PARENT_TYPES)[number]> = {
  2: 'twoColumns',
  3: 'threeColumns',
  4: 'fourColumns',
};

function createColumnsNode(
  config: ColumnsVariantConfig,
  includeCommands: boolean,
) {
  return Node.create({
    name: config.name,
    group: 'block',
    content: config.content,
    isolating: true,
    defining: true,

    addAttributes() {
      return createStandardAttributes([
        ...LAYOUT_ATTRIBUTES,
        ...COMMON_HTML_ATTRIBUTES,
      ]);
    },

    parseHTML() {
      return [{ tag: `div[data-type="${config.dataType}"]` }];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        'div',
        mergeAttributes(
          { 'data-type': config.dataType, class: 'node-columns' },
          HTMLAttributes,
        ),
        0,
      ];
    },

    ...(includeCommands && {
      addCommands() {
        return {
          insertColumns:
            (count: 2 | 3 | 4) =>
            ({
              commands,
              state,
            }: CommandProps & {
              state: { doc: ProseMirrorNode; selection: { from: number } };
            }) => {
              if (
                getColumnsDepth(state.doc, state.selection.from) >=
                MAX_COLUMNS_DEPTH
              ) {
                return false;
              }
              const nodeType = NODE_TYPE_MAP[count];
              const children = Array.from({ length: count }, () => ({
                type: 'columnsColumn',
                content: [{ type: 'paragraph', content: [] }],
              }));
              return commands.insertContent({
                type: nodeType,
                content: children,
              });
            },
        };
      },
    }),

    renderToReactEmail({ children, node, style }) {
      const inlineStyles = inlineCssToJs(node.attrs?.style);
      return (
        <Row
          className={node.attrs?.class || undefined}
          style={{ ...style, ...inlineStyles }}
        >
          {children}
        </Row>
      );
    },
  });
}

export const TwoColumns = createColumnsNode(VARIANTS[0], true);
export const ThreeColumns = createColumnsNode(VARIANTS[1], false);
export const FourColumns = createColumnsNode(VARIANTS[2], false);

export const ColumnsColumn = Node.create({
  name: 'columnsColumn',
  group: 'columnsColumn',
  content: 'block+',
  isolating: true,

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...LAYOUT_ATTRIBUTES,
        ...COMMON_HTML_ATTRIBUTES,
      ]),
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { 'data-type': 'column', class: 'node-column' },
        HTMLAttributes,
      ),
      0,
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { empty, $from } = selection;

        if (!empty) return false;

        for (let depth = $from.depth; depth >= 1; depth--) {
          if ($from.pos !== $from.start(depth)) break;

          const indexInParent = $from.index(depth - 1);

          if (indexInParent === 0) continue;

          const parent = $from.node(depth - 1);
          const prevNode = parent.child(indexInParent - 1);

          if (COLUMN_PARENT_SET.has(prevNode.type.name)) {
            const deleteFrom = $from.before(depth) - prevNode.nodeSize;
            const deleteTo = $from.before(depth);
            editor.view.dispatch(state.tr.delete(deleteFrom, deleteTo));
            return true;
          }

          break;
        }

        return false;
      },
      'Mod-a': ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;

        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name !== 'columnsColumn') {
            continue;
          }

          const columnStart = $from.start(d);
          const columnEnd = $from.end(d);
          const { from, to } = state.selection;

          if (from === columnStart && to === columnEnd) {
            return false;
          }

          editor.view.dispatch(
            state.tr.setSelection(
              TextSelection.create(state.doc, columnStart, columnEnd),
            ),
          );
          return true;
        }

        return false;
      },
    };
  },

  renderToReactEmail({ children, node, style }) {
    const inlineStyles = inlineCssToJs(node.attrs?.style);
    const width = node.attrs?.width;
    return (
      <Column
        className={node.attrs?.class || undefined}
        style={{
          ...style,
          ...inlineStyles,
          ...(width ? { width } : {}),
        }}
      >
        {children}
      </Column>
    );
  },
});
