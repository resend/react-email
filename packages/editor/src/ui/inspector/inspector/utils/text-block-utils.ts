import type { useCurrentEditor } from '@tiptap/react';
import type { NodeClickedEvent } from '@/types/editor/styles';
import {
  ensureBorderStyleFallback,
  expandShorthandProperties,
  inlineCssToJs,
  jsToInlineCss,
} from '../../../../utils/styles';
import {
  CSS_UNIT_MAP,
  type EditorSnapshot,
  MARK_TOGGLES,
  PADDING_KEYS,
  type ParentBlockInfo,
} from '../config/text-config';

type Editor = NonNullable<ReturnType<typeof useCurrentEditor>['editor']>;

// ---------------------------------------------------------------------------
// Block info helpers
// ---------------------------------------------------------------------------

/**
 * Derive block info from an explicit node position (node-selection mode).
 * Re-reads the node from the document so edits are reflected immediately.
 */
export function getBlockInfoFromNodeData(
  editor: Editor | null,
  nodeData: NodeClickedEvent,
): ParentBlockInfo {
  if (!editor) {
    return { alignment: 'left', pos: 0, nodeType: 'paragraph', attrs: {} };
  }
  const node = editor.state.doc.nodeAt(nodeData.nodePos.pos);
  if (!node) {
    return {
      alignment: 'left',
      pos: nodeData.nodePos.pos,
      nodeType: nodeData.nodeType,
      attrs: { ...nodeData.nodeAttrs },
    };
  }
  const alignment =
    (node.attrs.align as string) || (node.attrs.alignment as string) || 'left';
  return {
    alignment,
    pos: nodeData.nodePos.pos,
    nodeType: node.type.name,
    attrs: { ...node.attrs },
  };
}

/**
 * Derive block info by walking up from the current cursor position to find
 * the nearest block-level ancestor.
 */
export function getParentBlockInfo(editor: Editor | null): ParentBlockInfo {
  if (!editor) {
    return {
      alignment: 'left',
      pos: 0,
      nodeType: 'paragraph',
      attrs: {},
    };
  }

  const { from } = editor.state.selection;
  const resolvedPos = editor.state.doc.resolve(from);

  for (let depth = resolvedPos.depth; depth > 0; depth--) {
    const node = resolvedPos.node(depth);
    if (node.isBlock) {
      const alignment =
        (node.attrs.align as string) ||
        (node.attrs.alignment as string) ||
        'left';
      return {
        alignment,
        pos: resolvedPos.before(depth),
        nodeType: node.type.name,
        attrs: { ...node.attrs },
      };
    }
  }

  return {
    alignment: 'left',
    pos: 0,
    nodeType: 'paragraph',
    attrs: {},
  };
}

// ---------------------------------------------------------------------------
// Block style mutation
// ---------------------------------------------------------------------------

/**
 * Update CSS properties on the inline `style` attribute of the block node at
 * `parentPos`. Accepts a single key/value or an array of changes (batched into
 * one transaction).
 */
export function updateParentBlockStyle(
  editor: Editor | null,
  parentPos: number,
  styleKeyOrChanges: string | [string, string | number][],
  value?: string | number,
): void {
  if (!editor || parentPos < 0) {
    return;
  }
  const node = editor.state.doc.nodeAt(parentPos);
  if (!node) {
    return;
  }
  const currentStyle = (node.attrs.style as string) || '';
  const parsed = inlineCssToJs(currentStyle, { removeUnit: false });
  const expanded = expandShorthandProperties(parsed) as Record<
    string,
    string | number
  >;

  const changes: [string, string | number][] = Array.isArray(styleKeyOrChanges)
    ? styleKeyOrChanges
    : [[styleKeyOrChanges, value!]];

  for (const [styleKey, v] of changes) {
    if (v === '' || v === undefined) {
      delete expanded[styleKey];
    } else {
      const unit = CSS_UNIT_MAP[styleKey];
      expanded[styleKey] = unit && typeof v === 'number' ? `${v}${unit}` : v;
    }
  }

  ensureBorderStyleFallback(expanded);

  const newStyle = jsToInlineCss(expanded);
  const tr = editor.state.tr.setNodeMarkup(parentPos, null, {
    ...node.attrs,
    style: newStyle,
  });
  editor.view.dispatch(tr);
}

/**
 * Batch-update padding properties on the inline `style` attribute of the
 * block node at `parentPos`. Passing `undefined` for a padding key removes it.
 */
export function updateParentBlockPadding(
  editor: Editor | null,
  parentPos: number,
  values: Record<string, number | undefined>,
): void {
  if (!editor || parentPos < 0) {
    return;
  }
  const node = editor.state.doc.nodeAt(parentPos);
  if (!node) {
    return;
  }
  const currentStyle = (node.attrs.style as string) || '';
  const parsed = inlineCssToJs(currentStyle, { removeUnit: false });
  const expanded = expandShorthandProperties(parsed) as Record<
    string,
    string | number
  >;
  for (const key of PADDING_KEYS) {
    if (values[key] === undefined) {
      delete expanded[key];
    } else {
      expanded[key] = `${values[key]}px`;
    }
  }
  const newStyle = jsToInlineCss(expanded);
  const tr = editor.state.tr.setNodeMarkup(parentPos, null, {
    ...node.attrs,
    style: newStyle,
  });
  editor.view.dispatch(tr);
}

// ---------------------------------------------------------------------------
// Text type helpers
// ---------------------------------------------------------------------------

/**
 * Convert a node type + heading level into the text-type toggle value
 * (`'title'`, `'subtitle'`, `'heading'`, or `'body'`).
 */
export function textTypeValue(nodeType: string, level?: number): string {
  if (nodeType === 'paragraph') {
    return 'body';
  }
  if (nodeType === 'heading') {
    if (level === 1) {
      return 'title';
    }
    if (level === 2) {
      return 'subtitle';
    }
    if (level === 3) {
      return 'heading';
    }
  }
  return 'body';
}

// ---------------------------------------------------------------------------
// Mark toggle helpers
// ---------------------------------------------------------------------------

/**
 * Given an editor chain, the desired mark values, and the current editor
 * state, toggle only the marks that differ. Returns the (possibly extended)
 * chain so callers can continue chaining.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyMarkToggles(
  chain: any,
  arr: string[],
  state: EditorSnapshot,
) {
  for (const { value, active, toggle } of MARK_TOGGLES) {
    if (arr.includes(value) !== active(state)) {
      chain = chain[toggle]();
    }
  }
  return chain;
}
