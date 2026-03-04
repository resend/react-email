import type { Editor } from '@tiptap/core';

export function setTextAlignment(editor: Editor, alignment: string) {
  const { from, to } = editor.state.selection;
  const tr = editor.state.tr;
  editor.state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.isTextblock) {
      const prop = 'align' in node.attrs ? 'align' : 'alignment';
      tr.setNodeMarkup(pos, null, { ...node.attrs, [prop]: alignment });
    }
  });
  editor.view.dispatch(tr);
}
