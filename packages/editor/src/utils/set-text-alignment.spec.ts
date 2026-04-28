import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { AlignmentAttribute } from '../extensions/alignment-attribute';
import { setTextAlignment } from './set-text-alignment';

function createEditor(content?: Record<string, unknown>) {
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

const MULTI_BLOCK_DOC = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'First' }],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Second' }],
    },
  ],
};

describe('setTextAlignment', () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it('sets alignment on paragraph with cursor inside', () => {
    editor = createEditor(PARAGRAPH_DOC);
    editor.commands.setTextSelection(3);

    setTextAlignment(editor, 'center');

    const paragraph = editor.state.doc.firstChild!;
    expect(paragraph.attrs.alignment).toBe('center');
  });

  it('sets alignment on heading with cursor inside', () => {
    editor = createEditor(HEADING_DOC);
    editor.commands.setTextSelection(2);

    setTextAlignment(editor, 'right');

    const heading = editor.state.doc.firstChild!;
    expect(heading.attrs.alignment).toBe('right');
  });

  it('sets alignment on all textblocks in a range selection', () => {
    editor = createEditor(MULTI_BLOCK_DOC);
    editor.commands.setTextSelection({ from: 2, to: 10 });

    setTextAlignment(editor, 'center');

    editor.state.doc.descendants((node) => {
      if (node.isTextblock) {
        expect(node.attrs.alignment).toBe('center');
      }
    });
  });

  it('preserves existing node attributes when setting alignment', () => {
    editor = createEditor(HEADING_DOC);
    editor.commands.setTextSelection(2);

    setTextAlignment(editor, 'right');

    const heading = editor.state.doc.firstChild!;
    expect(heading.attrs.level).toBe(1);
    expect(heading.attrs.alignment).toBe('right');
  });

  it('overrides a previous alignment value', () => {
    editor = createEditor(PARAGRAPH_DOC);
    editor.commands.setTextSelection(3);

    setTextAlignment(editor, 'right');
    setTextAlignment(editor, 'center');

    const paragraph = editor.state.doc.firstChild!;
    expect(paragraph.attrs.alignment).toBe('center');
  });
});
