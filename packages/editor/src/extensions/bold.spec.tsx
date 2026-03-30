import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Bold } from './bold';

function createEditor(content?: string) {
  return new Editor({
    extensions: [StarterKit.configure({ bold: false }), Bold],
    content: content ?? '<p>hello world</p>',
  });
}

describe('Bold', () => {
  it('parses semantic bold elements', () => {
    const editor = createEditor('<p><strong>hello</strong> world</p>');

    editor.commands.setTextSelection({ from: 1, to: 6 });

    expect(editor.isActive('bold')).toBe(true);
    editor.destroy();
  });

  it('does not infer bold from font-weight styles alone', () => {
    const editor = createEditor(
      '<p><span style="font-weight: 600">hello</span> world</p>',
    );

    editor.commands.setTextSelection({ from: 1, to: 6 });

    expect(editor.isActive('bold')).toBe(false);
    editor.destroy();
  });
});
