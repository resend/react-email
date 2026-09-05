import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { setTextAlignment } from '../utils/set-text-alignment';
import { AlignmentAttribute } from './alignment-attribute';

function createEditor(content?: string) {
  return new Editor({
    extensions: [
      StarterKit,
      AlignmentAttribute.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content ?? '<p>hello world</p>',
  });
}

describe('AlignmentAttribute', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('persists an explicit left alignment to the HTML', () => {
    editor = createEditor();
    editor.commands.setTextSelection(3);
    setTextAlignment(editor, 'left');

    expect(editor.getHTML()).toContain('alignment="left"');
  });

  it('persists center alignment to the HTML', () => {
    editor = createEditor();
    editor.commands.setTextSelection(3);
    setTextAlignment(editor, 'center');

    expect(editor.getHTML()).toContain('alignment="center"');
  });
});
