import { type AnyExtension, Editor, type JSONContent } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { StarterKit } from './index';
import { TrailingNode } from './trailing-node';

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

function createEditor(extensions: AnyExtension[], content: JSONContent) {
  const editor = new Editor({
    extensions,
    content,
  });
  // appendTransaction only runs when a transaction is dispatched,
  // not on initial state creation, so we trigger one here.
  editor.view.dispatch(editor.state.tr);
  return editor;
}

describe('TrailingNode', () => {
  let editor: Editor;

  afterEach(() => {
    editor.destroy();
  });

  it('inserts a trailing paragraph at the end of the doc by default', () => {
    editor = createEditor(
      [
        StarterKit.configure({ TrailingNode: false, Container: false }),
        TrailingNode,
      ],
      {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Hello' }],
          },
        ],
      },
    );

    const json = editor.getJSON();
    expect(json.content).toHaveLength(2);
    expect(json.content![0].type).toBe('heading');
    expect(json.content![1].type).toBe('paragraph');
  });

  it('appends a trailing node inside the appendTo node type', () => {
    editor = createEditor(
      [
        StarterKit.configure({ TrailingNode: false }),
        TrailingNode.configure({ appendTo: 'container' }),
      ],
      {
        type: 'doc',
        content: [
          {
            type: 'container',
            content: [
              {
                type: 'heading',
                attrs: { level: 1 },
                content: [{ type: 'text', text: 'Hello' }],
              },
            ],
          },
        ],
      },
    );

    const json = editor.getJSON();
    const container = json.content!.find((n) => n.type === 'container');
    expect(container).toBeDefined();
    expect(container!.content).toHaveLength(2);
    expect(container!.content![0].type).toBe('heading');
    expect(container!.content![1].type).toBe('paragraph');
  });

  it('inserts a trailing paragraph inside the container with the default StarterKit', () => {
    editor = createEditor([StarterKit], {
      type: 'doc',
      content: [
        {
          type: 'container',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Hello' }],
            },
          ],
        },
      ],
    });

    const json = editor.getJSON();
    const container = json.content!.find((n) => n.type === 'container');
    expect(container).toBeDefined();
    expect(container!.content).toHaveLength(2);
    expect(container!.content![0].type).toBe('heading');
    expect(container!.content![1].type).toBe('paragraph');
  });

  it('appends trailing nodes to multiple instances of the appendTo node type', () => {
    editor = createEditor(
      [
        StarterKit.configure({ TrailingNode: false }),
        TrailingNode.configure({ appendTo: 'container' }),
      ],
      {
        type: 'doc',
        content: [
          {
            type: 'container',
            content: [
              {
                type: 'heading',
                attrs: { level: 1 },
                content: [{ type: 'text', text: 'First' }],
              },
            ],
          },
          {
            type: 'container',
            content: [
              {
                type: 'heading',
                attrs: { level: 1 },
                content: [{ type: 'text', text: 'Second' }],
              },
            ],
          },
        ],
      },
    );

    const json = editor.getJSON();
    const containers = json.content!.filter((n) => n.type === 'container');
    expect(containers).toHaveLength(2);

    for (const container of containers) {
      expect(container.content).toHaveLength(2);
      expect(container.content![0].type).toBe('heading');
      expect(container.content![1].type).toBe('paragraph');
    }
  });

  it('always inserts a paragraph as the trailing node, never a container', () => {
    editor = createEditor([StarterKit], {
      type: 'doc',
      content: [
        {
          type: 'container',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Hello' }],
            },
          ],
        },
      ],
    });

    const json = editor.getJSON();
    const container = json.content!.find((n) => n.type === 'container')!;
    const trailingNode = container.content![container.content!.length - 1];
    expect(trailingNode.type).toBe('paragraph');
  });

  it('handles notAfter as a string the same as a single-element array', () => {
    editor = createEditor(
      [
        StarterKit.configure({ TrailingNode: false, Container: false }),
        TrailingNode.configure({ notAfter: 'heading' }),
      ],
      {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Hello' }],
          },
        ],
      },
    );

    const json = editor.getJSON();
    expect(json.content).toHaveLength(1);
    expect(json.content![0].type).toBe('heading');
  });

  it('does not treat notAfter string as a substring match', () => {
    // "table" is a substring of "tableRow"; with the old bug,
    // `"tableRow".concat("paragraph")` produced the string
    // "tableRowparagraph" and `.includes("table")` matched via
    // substring, incorrectly suppressing trailing nodes after tables.
    editor = createEditor(
      [
        StarterKit.configure({ TrailingNode: false, Container: false }),
        TrailingNode.configure({ notAfter: 'tableRow' }),
      ],
      {
        type: 'doc',
        content: [
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'cell' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    );

    const json = editor.getJSON();
    expect(json.content!.at(-1)!.type).toBe('paragraph');
    expect(json.content!.at(-1)!.content).toBeUndefined();
  });
});
