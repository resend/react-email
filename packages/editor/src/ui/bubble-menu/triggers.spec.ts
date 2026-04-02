import type { Editor } from '@tiptap/core';
import type { EditorState } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { bubbleMenuTriggers } from './triggers';

function createMockParams(overrides: {
  isActive?: (name: string) => boolean;
  selectionSize?: number;
  nodeAtDepth?: (d: number) => { type: { name: string } };
  fromDepth?: number;
}) {
  const {
    isActive = () => false,
    selectionSize = 5,
    nodeAtDepth = () => ({ type: { name: 'paragraph' } }),
    fromDepth = 1,
  } = overrides;

  return {
    editor: {
      isActive,
      view: {
        state: { selection: { content: () => ({ size: selectionSize }) } },
      },
    } as unknown as Editor,
    view: {} as unknown as EditorView,
    state: {
      selection: {
        $from: { depth: fromDepth, node: nodeAtDepth },
        content: () => ({ size: selectionSize }),
      },
    } as unknown as EditorState,
    from: 0,
    to: selectionSize,
  };
}

describe('bubbleMenuTriggers', () => {
  describe('textSelection', () => {
    it('shows when there is a non-empty text selection', () => {
      const trigger = bubbleMenuTriggers.textSelection();
      expect(trigger(createMockParams({ selectionSize: 5 }))).toBe(true);
    });

    it('hides when selection is empty', () => {
      const trigger = bubbleMenuTriggers.textSelection();
      expect(trigger(createMockParams({ selectionSize: 0 }))).toBe(false);
    });

    it('hides when an excluded node is active', () => {
      const trigger = bubbleMenuTriggers.textSelection(['codeBlock']);
      expect(
        trigger(createMockParams({ isActive: (n) => n === 'codeBlock' })),
      ).toBe(false);
    });

    it('hides when an excluded node is in ancestor chain', () => {
      const trigger = bubbleMenuTriggers.textSelection(['codeBlock']);
      const params = createMockParams({
        fromDepth: 2,
        nodeAtDepth: (d) => ({
          type: { name: d === 2 ? 'paragraph' : 'codeBlock' },
        }),
      });
      expect(trigger(params)).toBe(false);
    });

    it('hides when an excluded mark is active', () => {
      const trigger = bubbleMenuTriggers.textSelection([], ['link']);
      expect(
        trigger(createMockParams({ isActive: (n) => n === 'link' })),
      ).toBe(false);
    });
  });

  describe('node', () => {
    it('shows when the specified node is active', () => {
      const trigger = bubbleMenuTriggers.node('button');
      expect(
        trigger(createMockParams({ isActive: (n) => n === 'button' })),
      ).toBe(true);
    });

    it('hides when the specified node is not active', () => {
      const trigger = bubbleMenuTriggers.node('button');
      expect(trigger(createMockParams({}))).toBe(false);
    });
  });

  describe('nodeWithoutSelection', () => {
    it('shows when node is active and selection is empty', () => {
      const trigger = bubbleMenuTriggers.nodeWithoutSelection('link');
      expect(
        trigger(
          createMockParams({ isActive: (n) => n === 'link', selectionSize: 0 }),
        ),
      ).toBe(true);
    });

    it('hides when there is a text selection', () => {
      const trigger = bubbleMenuTriggers.nodeWithoutSelection('link');
      expect(
        trigger(
          createMockParams({ isActive: (n) => n === 'link', selectionSize: 5 }),
        ),
      ).toBe(false);
    });

    it('hides when node is not active', () => {
      const trigger = bubbleMenuTriggers.nodeWithoutSelection('link');
      expect(trigger(createMockParams({ selectionSize: 0 }))).toBe(false);
    });
  });
});
