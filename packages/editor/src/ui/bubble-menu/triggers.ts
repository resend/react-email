import type { Editor } from '@tiptap/core';
import type { EditorState } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

export interface TriggerParams {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  from: number;
  to: number;
}

export type TriggerFn = (params: TriggerParams) => boolean;

export const bubbleMenuTriggers = {
  textSelection(
    hideWhenActiveNodes: string[] = [],
    hideWhenActiveMarks: string[] = [],
  ): TriggerFn {
    return ({ editor, state }) => {
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
      return editor.view.state.selection.content().size > 0;
    };
  },

  node(name: string): TriggerFn {
    return ({ editor }) => editor.isActive(name);
  },

  nodeWithoutSelection(name: string): TriggerFn {
    return ({ editor }) =>
      editor.isActive(name) && editor.view.state.selection.content().size === 0;
  },
};
