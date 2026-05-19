import { type CommandProps, type Editor, mergeAttributes } from '@tiptap/core';
import type { Node as ProseMirrorNode, ResolvedPos } from '@tiptap/pm/model';
import {
  type EditorState,
  NodeSelection,
  TextSelection,
  type Transaction,
} from '@tiptap/pm/state';
import { Column, Row } from 'react-email';
import { EmailNode } from '../core/serializer/email-node';
import {
  COMMON_HTML_ATTRIBUTES,
  createStandardAttributes,
  LAYOUT_ATTRIBUTES,
} from '../utils/attribute-helpers';
import { inlineCssToJs } from '../utils/styles';

const COLUMN_PARENT_ATTRIBUTES = ['cellspacing'] as const;

function getColumnGapCss(cellspacing: unknown): string | undefined {
  if (cellspacing === undefined || cellspacing === null || cellspacing === '') {
    return undefined;
  }

  const value = String(cellspacing).trim();
  if (value === '') {
    return undefined;
  }

  if (/^\d+(\.\d+)?$/.test(value)) {
    return `${value}px`;
  }

  return value;
}

function getRowCellSpacing(cellspacing: unknown): string | undefined {
  if (cellspacing === undefined || cellspacing === null || cellspacing === '') {
    return undefined;
  }

  const value = String(cellspacing).trim();
  if (value === '' || value === '0') {
    return undefined;
  }

  return value;
}

function mergeColumnsEditorStyle(
  spacing: unknown,
  existingStyle: unknown,
): string | undefined {
  const gap = getColumnGapCss(spacing);
  const currentStyle =
    typeof existingStyle === 'string' && existingStyle.trim() !== ''
      ? existingStyle.trim()
      : '';

  if (!gap) {
    return currentStyle || undefined;
  }

  const separator = currentStyle.endsWith(';') ? '' : ';';
  return currentStyle
    ? `${currentStyle}${separator}gap:${gap};`
    : `gap:${gap};`;
}

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

function isColumnEmpty(col: ProseMirrorNode): boolean {
  return (
    col.childCount === 1 &&
    col.firstChild?.type.name === 'paragraph' &&
    col.firstChild?.childCount === 0
  );
}

function deleteColumnParent(
  editor: Editor,
  state: EditorState,
  from: number,
  to: number,
  parentChildCount: number,
): boolean {
  const tr = state.tr;
  if (parentChildCount === 1) {
    tr.replaceWith(from, to, state.schema.nodes.paragraph.create());
  } else {
    tr.delete(from, to);
  }
  tr.setSelection(TextSelection.near(tr.doc.resolve(from)));
  editor.view.dispatch(tr);
  return true;
}

function handleNodeSelectionBackspace(
  editor: Editor,
  selection: EditorState['selection'],
  $from: ResolvedPos,
  state: EditorState,
): boolean {
  if (!(selection instanceof NodeSelection)) return false;
  if (!COLUMN_PARENT_SET.has(selection.node.type.name)) return false;

  const allColumnsEmpty = Array.from(
    { length: selection.node.childCount },
    (_, i) => selection.node.child(i),
  ).every(isColumnEmpty);

  if (!allColumnsEmpty) return false;

  const parent = $from.node($from.depth);
  return deleteColumnParent(
    editor,
    state,
    selection.from,
    selection.to,
    parent.childCount,
  );
}

function handleCursorBackspace(
  editor: Editor,
  $from: ResolvedPos,
  state: EditorState,
): boolean {
  for (let depth = $from.depth; depth >= 1; depth--) {
    const currentNode = $from.node(depth);

    if (currentNode.type.name === 'columnsColumn') {
      return handleBackspaceInsideColumn(editor, $from, state, depth);
    }

    const indexInParent = $from.index(depth - 1);

    if (indexInParent === 0) continue;

    const parent = $from.node(depth - 1);
    const prevNode = parent.child(indexInParent - 1);

    if (COLUMN_PARENT_SET.has(prevNode.type.name)) {
      const from = $from.before(depth) - prevNode.nodeSize;
      const to = $from.before(depth);
      editor.view.dispatch(state.tr.delete(from, to));
      return true;
    }

    break;
  }

  return false;
}

function handleBackspaceInsideColumn(
  editor: Editor,
  $from: ResolvedPos,
  state: EditorState,
  depth: number,
): boolean {
  const column = $from.node(depth);
  const columnParent = $from.node(depth - 1);

  if (!COLUMN_PARENT_SET.has(columnParent.type.name)) return false;
  if (!isColumnEmpty(column)) return false;

  const deletedIndex = $from.index(depth - 1);
  const remainingColumns = Array.from(
    { length: columnParent.childCount },
    (_, i) => columnParent.child(i),
  ).filter((_, i) => i !== deletedIndex);

  const columnParentFrom = $from.before(depth - 1);
  const columnParentTo = $from.after(depth - 1);
  const tr = state.tr;
  const deletingFirstColumn = deletedIndex === 0;
  const focusIndex = deletingFirstColumn ? 0 : deletedIndex - 1;
  const direction = deletingFirstColumn ? 'right' : 'left';

  if (remainingColumns.length === 1) {
    // 2 → 1: replace the column layout with the surviving column's content
    const survivingContent = Array.from(
      { length: remainingColumns[0].childCount },
      (_, i) => remainingColumns[0].child(i),
    );
    const replacement =
      survivingContent.length > 0
        ? survivingContent
        : [state.schema.nodes.paragraph.create()];
    tr.replaceWith(columnParentFrom, columnParentTo, replacement);
    const totalReplacementSize = replacement.reduce(
      (sum, n) => sum + n.nodeSize,
      0,
    );
    const cursorPos = deletingFirstColumn
      ? columnParentFrom + 1
      : columnParentFrom + totalReplacementSize;
    tr.setSelection(
      TextSelection.near(
        tr.doc.resolve(cursorPos),
        direction === 'right' ? 1 : -1,
      ),
    );
  } else {
    // 3 → 2 or 4 → 3: convert to the smaller column layout
    const smallerLayoutType =
      state.schema.nodes[NODE_TYPE_MAP[remainingColumns.length]];
    tr.replaceWith(
      columnParentFrom,
      columnParentTo,
      smallerLayoutType.create(columnParent.attrs, remainingColumns),
    );
    focusColumn(tr, columnParentFrom, remainingColumns, focusIndex, direction);
  }

  editor.view.dispatch(tr);
  return true;
}

function focusColumn(
  tr: Transaction,
  columnParentPos: number,
  columns: ProseMirrorNode[],
  index: number,
  direction: 'left' | 'right' = 'right',
): void {
  let pos = columnParentPos + 1;
  for (let i = 0; i < index; i++) {
    pos += columns[i].nodeSize;
  }
  pos += 1;

  if (direction === 'left') {
    pos += columns[index].content.size;
  }

  const bias = direction === 'right' ? 1 : -1;
  tr.setSelection(TextSelection.near(tr.doc.resolve(pos), bias));
}

function createColumnsNode(
  config: ColumnsVariantConfig,
  includeCommands: boolean,
) {
  return EmailNode.create({
    name: config.name,
    group: 'block',
    content: config.content,
    isolating: true,
    defining: true,

    addAttributes() {
      return createStandardAttributes([
        ...LAYOUT_ATTRIBUTES,
        ...COMMON_HTML_ATTRIBUTES,
        ...COLUMN_PARENT_ATTRIBUTES,
      ]);
    },

    parseHTML() {
      return [{ tag: `div[data-type="${config.dataType}"]` }];
    },

    renderHTML({ HTMLAttributes }) {
      const { style, cellspacing, ...attributes } = HTMLAttributes as Record<
        string,
        unknown
      >;
      const mergedStyle = mergeColumnsEditorStyle(cellspacing, style);

      return [
        'div',
        mergeAttributes(
          {
            'data-type': config.dataType,
            class: 'node-columns',
            ...(mergedStyle ? { style: mergedStyle } : {}),
          },
          attributes,
        ),
        0,
      ];
    },

    ...(includeCommands && {
      addCommands() {
        return {
          insertColumns:
            (count: 2 | 3 | 4) =>
            ({ state, dispatch }: CommandProps) => {
              const tooDeep =
                getColumnsDepth(state.doc, state.selection.from) >=
                MAX_COLUMNS_DEPTH;
              if (tooDeep) return false;

              const emptyColumn = () =>
                state.schema.nodes.columnsColumn.create(
                  null,
                  state.schema.nodes.paragraph.create(),
                );

              const columnBlock = state.schema.nodes[
                NODE_TYPE_MAP[count]
              ].create(null, Array.from({ length: count }, emptyColumn));

              const tr = state.tr.replaceSelectionWith(columnBlock);

              // Find the inserted column block and focus its first column
              const $head = tr.selection.$head;
              for (let d = $head.depth; d >= 0; d--) {
                if (!COLUMN_PARENT_SET.has($head.node(d).type.name)) continue;
                const insertedColumns = Array.from(
                  { length: $head.node(d).childCount },
                  (_, i) => $head.node(d).child(i),
                );
                focusColumn(tr, $head.before(d), insertedColumns, 0);
                break;
              }

              if (dispatch) dispatch(tr);
              return true;
            },
        };
      },
    }),

    renderToReactEmail({ children, node, style }) {
      const inlineStyles = inlineCssToJs(node.attrs?.style);
      const cellSpacing = getRowCellSpacing(node.attrs?.cellspacing);

      return (
        <Row
          className={node.attrs?.class || undefined}
          style={{ ...style, ...inlineStyles }}
          {...(cellSpacing ? { cellSpacing } : {})}
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

export const ColumnsColumn = EmailNode.create({
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

        if (!empty) {
          return handleNodeSelectionBackspace(editor, selection, $from, state);
        }

        if ($from.parentOffset !== 0) return false;

        return handleCursorBackspace(editor, $from, state);
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
