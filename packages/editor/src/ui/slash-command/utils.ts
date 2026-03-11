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
  const containerRect = container.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  if (itemRect.top < containerRect.top) {
    container.scrollTop -= containerRect.top - itemRect.top;
  } else if (itemRect.bottom > containerRect.bottom) {
    container.scrollTop += itemRect.bottom - containerRect.bottom;
  }
}
