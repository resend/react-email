import type { Node } from '@tiptap/pm/model';
import { describe, expect, it } from 'vitest';
import { isDocumentVisuallyEmpty } from './is-document-visually-empty';

type MockDoc = {
  childCount: number;
  child: (index: number) => {
    type: { name: string };
    textContent: string;
    content: { childCount: number };
  };
};

function createDoc(
  nodes: Array<{ type: string; textContent?: string; childCount?: number }>,
): Node {
  const doc: MockDoc = {
    childCount: nodes.length,
    child: (index) => ({
      type: { name: nodes[index]!.type },
      textContent: nodes[index]!.textContent ?? '',
      content: { childCount: nodes[index]!.childCount ?? 0 },
    }),
  };

  return doc as unknown as Node;
}

describe('isDocumentVisuallyEmpty', () => {
  it('returns true when document only contains global content', () => {
    const doc = createDoc([{ type: 'globalContent' }]);

    expect(isDocumentVisuallyEmpty(doc)).toBe(true);
  });

  it('returns true when document contains global content and one empty paragraph', () => {
    const doc = createDoc([
      { type: 'globalContent' },
      { type: 'paragraph', textContent: '   ', childCount: 0 },
    ]);

    expect(isDocumentVisuallyEmpty(doc)).toBe(true);
  });

  it('returns false when document contains one empty paragraph with inline content', () => {
    const doc = createDoc([
      { type: 'paragraph', textContent: '   ', childCount: 1 },
    ]);

    expect(isDocumentVisuallyEmpty(doc)).toBe(false);
  });

  it('returns false when document contains multiple empty paragraphs', () => {
    const doc = createDoc([
      { type: 'paragraph', textContent: '', childCount: 0 },
      { type: 'paragraph', textContent: '   ', childCount: 0 },
    ]);

    expect(isDocumentVisuallyEmpty(doc)).toBe(false);
  });

  it('returns false when document contains only an image node', () => {
    const doc = createDoc([{ type: 'image' }]);

    expect(isDocumentVisuallyEmpty(doc)).toBe(false);
  });

  it('returns false when document contains both an image and pasted text', () => {
    const doc = createDoc([
      { type: 'image' },
      { type: 'paragraph', textContent: 'hello world' },
    ]);

    expect(isDocumentVisuallyEmpty(doc)).toBe(false);
  });
});
