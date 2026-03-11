import type { Editor } from '@tiptap/core';
import { getColumnsDepth, MAX_COLUMNS_DEPTH } from '../../extensions/columns';

export function isInsideNode(editor: Editor, type: string): boolean {
  const { $from } = editor.state.selection;
  for (let d = $from.depth; d > 0; d--) {
    if ($from.node(d).type.name === type) return true;
  }
  return false;
}

export function isAtMaxColumnsDepth(editor: Editor): boolean {
  const { from } = editor.state.selection;
  return getColumnsDepth(editor.state.doc, from) >= MAX_COLUMNS_DEPTH;
}

export function updateScrollView(
  container: HTMLElement,
  item: HTMLElement,
): void {
  const containerTop = container.scrollTop;
  const containerBottom = containerTop + container.clientHeight;
  const itemTop = item.offsetTop;
  const itemBottom = itemTop + item.clientHeight;

  if (itemTop < containerTop) {
    container.scrollTop = itemTop;
  } else if (itemBottom > containerBottom) {
    container.scrollTop = itemBottom - container.clientHeight;
  }
}
