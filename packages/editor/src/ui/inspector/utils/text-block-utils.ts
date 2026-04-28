import type { useCurrentEditor } from '@tiptap/react';
import type { NodeClickedEvent } from '../../../core/event-bus';
import {
  ensureBorderStyleFallback,
  expandShorthandProperties,
  inlineCssToJs,
  jsToInlineCss,
} from '../../../utils/styles';
import {
  CSS_UNIT_MAP,
  type EditorSnapshot,
  MARK_TOGGLES,
  PADDING_KEYS,
  type ParentBlockInfo,
} from '../config/text-config';

type Editor = NonNullable<ReturnType<typeof useCurrentEditor>['editor']>;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyMarkToggles(
  chain: any,
  arr: string[],
  state: EditorSnapshot,
) {
  let result = chain;
  for (const { value, active, toggle } of MARK_TOGGLES) {
    if (arr.includes(value) !== active(state)) {
      result = result[toggle]();
    }
  }
  return result;
}
