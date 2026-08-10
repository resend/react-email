import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { ClassAttribute } from './class-attribute';
import { StyleAttribute } from './style-attribute';

function createEditor(content: string) {
  return new Editor({
    extensions: [
      StarterKit,
      StyleAttribute.configure({ types: ['paragraph'] }),
      ClassAttribute.configure({ types: ['paragraph'] }),
    ],
    content,
  });
}

function pressEnter(editor: Editor) {
  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    bubbles: true,
    cancelable: true,
  });
  editor.view.someProp('handleKeyDown', (handler) =>
    handler(editor.view, event),
  );
}

/**
 * Extensions used to reset paragraph attributes in a
 * requestAnimationFrame callback after Enter, so flush a couple of
 * frames before asserting to catch any regression of that behavior.
 */
async function flushAnimationFrames() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

describe('splitting a paragraph with Enter', () => {
  it('preserves the style attribute on both resulting paragraphs', async () => {
    const editor = createEditor(
      '<p style="font-size: 24px; color: rgb(255, 0, 0)">Hello world</p>',
    );
    // Place the cursor between "Hello" and " world"
    editor.commands.setTextSelection(6);

    pressEnter(editor);
    await flushAnimationFrames();

    const paragraphs = editor.getJSON().content ?? [];
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].attrs?.style).toBe(
      'font-size: 24px; color: rgb(255, 0, 0)',
    );
    expect(paragraphs[1].attrs?.style).toBe(
      'font-size: 24px; color: rgb(255, 0, 0)',
    );

    editor.destroy();
  });

  it('preserves the class attribute on both resulting paragraphs', async () => {
    const editor = createEditor('<p class="lead">Hello world</p>');
    editor.commands.setTextSelection(6);

    pressEnter(editor);
    await flushAnimationFrames();

    const paragraphs = editor.getJSON().content ?? [];
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].attrs?.class).toBe('lead');
    expect(paragraphs[1].attrs?.class).toBe('lead');

    editor.destroy();
  });
});
