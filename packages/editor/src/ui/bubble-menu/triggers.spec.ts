import type { Editor } from '@tiptap/core';
import type { EditorView } from '@tiptap/pm/view';
import type { EditorState } from '@tiptap/pm/state';
import { bubbleMenuTriggers } from './triggers';

function createMockParams(overrides: {
  isActive?: (name: string) => boolean;
  selectionSize?: number;
  isDragging?: boolean;
  nodeAtDepth?: (d: number) => { type: { name: string } };
  fromDepth?: number;
}) {
  const {
    isActive = () => false,
    selectionSize = 5,
    isDragging = false,
    nodeAtDepth = () => ({ type: { name: 'paragraph' } }),
    fromDepth = 1,
  } = overrides;

  return {
    editor: { isActive, view: { state: { selection: { content: () => ({ size: selectionSize }) } } } } as unknown as Editor,
    view: { dom: { classList: { contains: (cls: string) => cls === 'dragging' && isDragging } } } as unknown as EditorView,
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
      const shouldShow = bubbleMenuTriggers.textSelection();
      expect(shouldShow(createMockParams({ selectionSize: 5 }))).toBe(true);
    });

    it('hides when selection is empty', () => {
      const shouldShow = bubbleMenuTriggers.textSelection();
      expect(shouldShow(createMockParams({ selectionSize: 0 }))).toBe(false);
    });

    it('hides when dragging', () => {
      const shouldShow = bubbleMenuTriggers.textSelection();
      expect(shouldShow(createMockParams({ isDragging: true }))).toBe(false);
    });

    it('hides when an excluded node is active', () => {
      const shouldShow = bubbleMenuTriggers.textSelection(['codeBlock']);
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'codeBlock' }))).toBe(false);
    });

    it('hides when an excluded node is in ancestor chain', () => {
      const shouldShow = bubbleMenuTriggers.textSelection(['codeBlock']);
      const params = createMockParams({
        fromDepth: 2,
        nodeAtDepth: (d) => ({ type: { name: d === 2 ? 'paragraph' : 'codeBlock' } }),
      });
      expect(shouldShow(params)).toBe(false);
    });

    it('hides when an excluded mark is active', () => {
      const shouldShow = bubbleMenuTriggers.textSelection([], ['link']);
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'link' }))).toBe(false);
    });
  });

  describe('node', () => {
    it('shows when the specified node is active', () => {
      const shouldShow = bubbleMenuTriggers.node('button');
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'button' }))).toBe(true);
    });

    it('hides when the specified node is not active', () => {
      const shouldShow = bubbleMenuTriggers.node('button');
      expect(shouldShow(createMockParams({}))).toBe(false);
    });

    it('hides when dragging', () => {
      const shouldShow = bubbleMenuTriggers.node('button');
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'button', isDragging: true }))).toBe(false);
    });
  });

  describe('nodeWithoutSelection', () => {
    it('shows when node is active and selection is empty', () => {
      const shouldShow = bubbleMenuTriggers.nodeWithoutSelection('link');
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'link', selectionSize: 0 }))).toBe(true);
    });

    it('hides when there is a text selection', () => {
      const shouldShow = bubbleMenuTriggers.nodeWithoutSelection('link');
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'link', selectionSize: 5 }))).toBe(false);
    });

    it('hides when node is not active', () => {
      const shouldShow = bubbleMenuTriggers.nodeWithoutSelection('link');
      expect(shouldShow(createMockParams({ selectionSize: 0 }))).toBe(false);
    });

    it('hides when dragging', () => {
      const shouldShow = bubbleMenuTriggers.nodeWithoutSelection('link');
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'link', selectionSize: 0, isDragging: true }))).toBe(false);
    });
  });
});
