import { Editor } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it, vi } from 'vitest';
import { StyleAttribute } from '../../extensions/style-attribute';
import { createImageExtension } from './extension';
import { executeUploadFlow } from './upload-flow';

vi.mock('@tiptap/react', () => ({
  ReactNodeViewRenderer: () => () => null,
  useEditorState: vi.fn(),
}));

function createEditor() {
  const uploadImage = vi.fn().mockResolvedValue({ url: '' });
  return new Editor({
    extensions: [
      StarterKit,
      createImageExtension({ uploadImage }),
      StyleAttribute.configure({ types: ['image'] }),
    ],
  });
}

function findImageNode(
  editor: Editor,
): { node: ProseMirrorNode; pos: number } | null {
  let result: { node: ProseMirrorNode; pos: number } | null = null;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'image') {
      result = { node, pos };
      return false;
    }
    return true;
  });
  return result;
}

describe('executeUploadFlow', () => {
  it('preserves the existing image attributes (e.g. style) when replacing a selected image', async () => {
    const editor = createEditor();

    // Insert an image carrying a custom style attribute. `style` is a global
    // attribute (from StyleAttribute), so insert via explicit content to set it.
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'image',
        attrs: {
          src: 'https://example.com/original.png',
          style: 'border-radius: 12px',
          width: '300',
          alt: 'logo',
        },
      })
      .run();

    const inserted = findImageNode(editor);
    expect(inserted).not.toBeNull();

    // Select the image via a NodeSelection (as clicking the atom would).
    const { tr } = editor.state;
    tr.setSelection(NodeSelection.create(editor.state.doc, inserted!.pos));
    editor.view.dispatch(tr);
    expect(editor.state.selection).toBeInstanceOf(NodeSelection);

    const file = new File(['data'], 'replacement.png', { type: 'image/png' });
    const uploadImage = vi
      .fn()
      .mockResolvedValue({ url: 'https://example.com/new.png' });

    await executeUploadFlow({ editor, file, uploadImage });

    const replaced = findImageNode(editor);
    expect(replaced).not.toBeNull();
    // src is updated to the uploaded url ...
    expect(replaced!.node.attrs.src).toBe('https://example.com/new.png');
    // ... while the custom styling and other attrs are preserved.
    expect(replaced!.node.attrs.style).toBe('border-radius: 12px');
    expect(replaced!.node.attrs.width).toBe('300');
    expect(replaced!.node.attrs.alt).toBe('logo');

    editor.destroy();
  });

  it('does not carry over attributes when no image is selected (fresh insert)', async () => {
    const editor = createEditor();
    editor.commands.focus();

    const file = new File(['data'], 'fresh.png', { type: 'image/png' });
    const uploadImage = vi
      .fn()
      .mockResolvedValue({ url: 'https://example.com/fresh.png' });

    await executeUploadFlow({ editor, file, uploadImage });

    const inserted = findImageNode(editor);
    expect(inserted).not.toBeNull();
    expect(inserted!.node.attrs.src).toBe('https://example.com/fresh.png');
    // Default style (empty) since nothing was selected.
    expect(inserted!.node.attrs.style).toBe('');

    editor.destroy();
  });
});
