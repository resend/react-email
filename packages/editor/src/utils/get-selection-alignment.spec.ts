import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { AlignmentAttribute } from '../extensions/alignment-attribute';
import { getSelectionAlignment } from './get-selection-alignment';
import { setTextAlignment } from './set-text-alignment';

function createEditor(content?: Record<string, unknown> | string) {
  return new Editor({
    extensions: [
      StarterKit,
      AlignmentAttribute.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content ?? undefined,
  });
}

const PARAGRAPH_DOC = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Hello world' }],
    },
  ],
};

const HEADING_DOC = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Title' }],
    },
  ],
};

describe('getSelectionAlignment', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('resolves to left when no explicit alignment is set', () => {
    editor = createEditor(PARAGRAPH_DOC);
    editor.commands.setTextSelection(3);

    expect(getSelectionAlignment(editor)).toBe('left');
    // The raw attribute stays null so natural inheritance still works
    expect(editor.getAttributes('paragraph').alignment).toBeNull();
  });

  it('resolves an explicit alignment', () => {
    editor = createEditor(PARAGRAPH_DOC);
    editor.commands.setTextSelection(3);
    setTextAlignment(editor, 'center');

    expect(getSelectionAlignment(editor)).toBe('center');
  });

  it('resolves alignment from the current heading textblock', () => {
    editor = createEditor(HEADING_DOC);
    editor.commands.setTextSelection(2);
    setTextAlignment(editor, 'right');

    expect(getSelectionAlignment(editor)).toBe('right');
  });
});
