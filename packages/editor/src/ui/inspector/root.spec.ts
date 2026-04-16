import { Editor } from '@tiptap/core';
import { describe, expect, it } from 'vitest';
import { StarterKit } from '../../extensions';
import { EmailTheming } from '../../plugins';
import { computePathFromRoot, type FocusedNode } from './root';

const BODY: FocusedNode = {
  nodeType: 'body',
  nodeAttrs: {},
  nodePos: { pos: 0, inside: 0 },
};

function createEditor(content: unknown) {
  return new Editor({
    extensions: [StarterKit, EmailTheming],
    content: content as string,
  });
}

function findNodePos(editor: Editor, nodeType: string): number {
  let pos = -1;
  editor.state.doc.descendants((node, position) => {
    if (pos === -1 && node.type.name === nodeType) {
      pos = position;
      return false;
    }
    return true;
  });
  return pos;
}

describe('computePathFromRoot', () => {
  it('returns [] when editor is null', () => {
    expect(computePathFromRoot(null, BODY)).toEqual([]);
  });

  it('prepends synthetic body for typical content (no body PM node)', () => {
    const editor = createEditor('<p>hello</p>');
    const paragraphPos = findNodePos(editor, 'paragraph');
    const target: FocusedNode = {
      nodeType: 'paragraph',
      nodeAttrs: {},
      nodePos: { pos: paragraphPos, inside: paragraphPos },
    };

    const path = computePathFromRoot(editor, target);

    expect(path.map((n) => n.nodeType)).toEqual(['body', 'paragraph']);
    expect(path[0].nodeAttrs).toEqual({});
  });

  it('does not duplicate body when hierarchy already contains a real body node', () => {
    const editor = createEditor({
      type: 'doc',
      content: [
        {
          type: 'body',
          attrs: { class: 'real-body' },
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'hi' }] },
          ],
        },
      ],
    });
    const paragraphPos = findNodePos(editor, 'paragraph');
    const target: FocusedNode = {
      nodeType: 'paragraph',
      nodeAttrs: {},
      nodePos: { pos: paragraphPos, inside: paragraphPos },
    };

    const path = computePathFromRoot(editor, target);

    expect(path.map((n) => n.nodeType)).toEqual(['body', 'paragraph']);
    // Body entry should be the real PM body (with its real attrs), not the
    // synthetic empty-attrs one.
    expect(path[0].nodeAttrs.class).toBe('real-body');
  });

  it('returns just [body] when target is the body FocusedNode', () => {
    const editor = createEditor('<p>hi</p>');
    const target: FocusedNode = {
      nodeType: 'body',
      nodeAttrs: {},
      nodePos: { pos: 0, inside: 0 },
    };

    const path = computePathFromRoot(editor, target);

    expect(path.map((n) => n.nodeType)).toEqual(['body']);
  });

  it('prepends synthetic body for text targets', () => {
    const editor = createEditor('<p>hello world</p>');
    editor.commands.setTextSelection(2);

    const path = computePathFromRoot(editor, 'text');

    expect(path[0].nodeType).toBe('body');
    expect(path.filter((n) => n.nodeType === 'body')).toHaveLength(1);
  });
});
