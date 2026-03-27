import type { Editor } from '@tiptap/core';
import type { EditorState } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

export interface ShouldShowParams {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  from: number;
  to: number;
}

export type ShouldShowFn = (params: ShouldShowParams) => boolean;

export const bubbleMenuTriggers = {
  textSelection(
    hideWhenActiveNodes: string[] = [],
    hideWhenActiveMarks: string[] = [],
  ): ShouldShowFn {
    return ({ editor, view, state }) => {
      for (const node of hideWhenActiveNodes) {
        if (editor.isActive(node)) {
          return false;
        }
        const { $from } = state.selection;
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === node) {
            return false;
          }
        }
      }
      for (const mark of hideWhenActiveMarks) {
        if (editor.isActive(mark)) {
          return false;
        }
      }
      if (view.dom.classList.contains('dragging')) {
        return false;
      }
      return editor.view.state.selection.content().size > 0;
    };
  },

  node(name: string): ShouldShowFn {
    return ({ editor, view }) =>
      editor.isActive(name) && !view.dom.classList.contains('dragging');
  },

  nodeWithoutSelection(name: string): ShouldShowFn {
    return ({ editor, view }) =>
      editor.isActive(name) &&
      !view.dom.classList.contains('dragging') &&
      editor.view.state.selection.content().size === 0;
  },
};
