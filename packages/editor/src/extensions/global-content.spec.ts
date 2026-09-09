import type { JSONContent } from '@tiptap/core';
import { Editor } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import { afterEach, describe, expect, it } from 'vitest';
import { StarterKit } from './index';

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

describe('GlobalContent Node', () => {
  let editor: Editor | null = null;

  afterEach(() => {
    editor?.destroy();
    editor = null;
  });

  function createEditor(content: JSONContent) {
    editor = new Editor({
      content,
      extensions: [StarterKit],
    });
    editor.view.dispatch(editor.state.tr);
    return editor;
  }

  it('preserves globalContent when selecting all and deleting', () => {
    const themeData = { theme: 'basic', css: 'body { color: red; }' };

    const ed = createEditor({
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: { data: themeData },
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world' }],
        },
      ],
    });

    const { state } = ed;
    const allSelection = TextSelection.create(
      state.doc,
      0,
      state.doc.content.size,
    );
    ed.view.dispatch(state.tr.setSelection(allSelection).deleteSelection());

    const json = ed.getJSON();
    const globalContentNodes = json.content!.filter(
      (n) => n.type === 'globalContent',
    );

    expect(globalContentNodes).toHaveLength(1);
    expect(globalContentNodes[0].attrs!.data).toEqual(themeData);
  });

  it('preserves globalContent data after multiple select-all + delete cycles', () => {
    const themeData = { theme: 'minimal', styles: [{ id: 'test' }] };

    const ed = createEditor({
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: { data: themeData },
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'First content' }],
        },
      ],
    });

    for (let i = 0; i < 3; i++) {
      const { state } = ed;
      const allSelection = TextSelection.create(
        state.doc,
        0,
        state.doc.content.size,
      );
      ed.view.dispatch(state.tr.setSelection(allSelection).deleteSelection());
    }

    const json = ed.getJSON();
    const globalContentNodes = json.content!.filter(
      (n) => n.type === 'globalContent',
    );

    expect(globalContentNodes).toHaveLength(1);
    expect(globalContentNodes[0].attrs!.data).toEqual(themeData);
  });

  it('does not duplicate globalContent when it already exists', () => {
    const ed = createEditor({
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: { data: { theme: 'basic' } },
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello' }],
        },
      ],
    });

    ed.commands.insertContent({
      type: 'paragraph',
      content: [{ type: 'text', text: 'New paragraph' }],
    });

    const json = ed.getJSON();
    const globalContentNodes = json.content!.filter(
      (n) => n.type === 'globalContent',
    );

    expect(globalContentNodes).toHaveLength(1);
  });

  it('restores globalContent at position 0 when deleted via replaceWith', () => {
    const themeData = { theme: 'basic', css: '.test {}' };

    const ed = createEditor({
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: { data: themeData },
        },
        {
          type: 'container',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Content' }],
            },
          ],
        },
      ],
    });

    const { state } = ed;
    const { schema } = state;
    const newParagraph = schema.nodes.paragraph.create(
      null,
      schema.text('Replaced content'),
    );
    const tr = state.tr.replaceWith(0, state.doc.content.size, newParagraph);
    ed.view.dispatch(tr);

    const json = ed.getJSON();
    const globalContentNodes = json.content!.filter(
      (n) => n.type === 'globalContent',
    );

    expect(globalContentNodes).toHaveLength(1);
    expect(globalContentNodes[0].attrs!.data).toEqual(themeData);
  });

  it('does not restore globalContent if it was never present', () => {
    const ed = createEditor({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'No global content here' }],
        },
      ],
    });

    ed.commands.clearContent();

    const json = ed.getJSON();
    const globalContentNodes = (json.content ?? []).filter(
      (n) => n.type === 'globalContent',
    );

    expect(globalContentNodes).toHaveLength(0);
  });

  it('setGlobalContent command creates globalContent if not present', () => {
    const ed = createEditor({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello' }],
        },
      ],
    });

    ed.commands.setGlobalContent('theme', 'basic');

    const json = ed.getJSON();
    const globalContentNodes = json.content!.filter(
      (n) => n.type === 'globalContent',
    );

    expect(globalContentNodes).toHaveLength(1);
    expect(globalContentNodes[0].attrs!.data.theme).toBe('basic');
  });

  it('setGlobalContent command updates existing globalContent data', () => {
    const ed = createEditor({
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: { data: { theme: 'basic' } },
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello' }],
        },
      ],
    });

    ed.commands.setGlobalContent('css', 'body { color: blue; }');

    const json = ed.getJSON();
    const globalContentNodes = json.content!.filter(
      (n) => n.type === 'globalContent',
    );

    expect(globalContentNodes).toHaveLength(1);
    expect(globalContentNodes[0].attrs!.data).toEqual({
      theme: 'basic',
      css: 'body { color: blue; }',
    });
  });
});
