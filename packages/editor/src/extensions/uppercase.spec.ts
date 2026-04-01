import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Uppercase } from './uppercase';

function createEditor(content?: string) {
  return new Editor({
    extensions: [StarterKit, Uppercase],
    content: content ?? '<p>hello world</p>',
  });
}

describe('Uppercase', () => {
  it('registers toggleUppercase command', () => {
    const editor = createEditor();
    expect(editor.commands.toggleUppercase).toBeDefined();
    editor.destroy();
  });

  it('toggles uppercase mark on selected text', () => {
    const editor = createEditor();
    editor.commands.setTextSelection({ from: 1, to: 6 });
    editor.commands.toggleUppercase();

    const html = editor.getHTML();
    expect(html).toContain('text-transform: uppercase');
    expect(html).toContain('<span');
    editor.destroy();
  });

  it('removes uppercase mark when toggled again', () => {
    const editor = createEditor();
    editor.commands.setTextSelection({ from: 1, to: 6 });
    editor.commands.toggleUppercase();
    editor.commands.toggleUppercase();

    const html = editor.getHTML();
    expect(html).not.toContain('text-transform: uppercase');
    editor.destroy();
  });

  it('parses HTML with text-transform: uppercase', () => {
    const editor = createEditor(
      '<p><span style="text-transform: uppercase">hello</span> world</p>',
    );

    editor.commands.setTextSelection({ from: 1, to: 6 });
    expect(editor.isActive('uppercase')).toBe(true);
    editor.destroy();
  });

  it('renders uppercase mark as span with inline style', () => {
    const editor = createEditor();
    editor.commands.setTextSelection({ from: 1, to: 6 });
    editor.commands.setUppercase();

    const html = editor.getHTML();
    expect(html).toContain('text-transform: uppercase');
    expect(html).toContain('<span');
    editor.destroy();
  });
});
