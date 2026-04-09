import { Schema } from '@tiptap/pm/model';
import { describe, expect, it } from 'vitest';
import { isDocumentVisuallyEmpty } from './is-document-visually-empty';

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'inline*' },
    text: { group: 'inline' },
    globalContent: { group: 'block', atom: true },
    container: { group: 'block', content: 'block+' },
    image: { group: 'block', atom: true },
    hardBreak: { group: 'inline', inline: true, selectable: false },
  },
});

describe('isDocumentVisuallyEmpty', () => {
  describe('without container', () => {
    it('returns true when document only contains global content', () => {
      const doc = schema.node('doc', null, [schema.node('globalContent')]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(true);
    });

    it('returns true when document contains global content and one empty paragraph', () => {
      const doc = schema.node('doc', null, [
        schema.node('globalContent'),
        schema.node('paragraph'),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(true);
    });

    it('returns false when paragraph contains whitespace text', () => {
      const doc = schema.node('doc', null, [
        schema.node('paragraph', null, [schema.text('   ')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when document contains multiple empty paragraphs', () => {
      const doc = schema.node('doc', null, [
        schema.node('paragraph'),
        schema.node('paragraph'),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when document contains only an image node', () => {
      const doc = schema.node('doc', null, [schema.node('image')]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when document contains both an image and text', () => {
      const doc = schema.node('doc', null, [
        schema.node('image'),
        schema.node('paragraph', null, [schema.text('hello world')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when paragraph contains only a hardBreak', () => {
      const doc = schema.node('doc', null, [
        schema.node('paragraph', null, [schema.node('hardBreak')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when paragraph contains a hardBreak alongside text', () => {
      const doc = schema.node('doc', null, [
        schema.node('paragraph', null, [
          schema.text('hello'),
          schema.node('hardBreak'),
        ]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('considers just white spaces as not empty', () => {
      const doc = schema.node('doc', null, [
        schema.node('paragraph', null, [schema.text('                 ')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });
  });

  describe('with container', () => {
    it('returns true when container holds one empty paragraph', () => {
      const doc = schema.node('doc', null, [
        schema.node('container', null, [schema.node('paragraph')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(true);
    });

    it('returns true when global content precedes a container with one empty paragraph', () => {
      const doc = schema.node('doc', null, [
        schema.node('globalContent'),
        schema.node('container', null, [schema.node('paragraph')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(true);
    });

    it('returns false when container holds a paragraph with text', () => {
      const doc = schema.node('doc', null, [
        schema.node('container', null, [
          schema.node('paragraph', null, [schema.text('hello')]),
        ]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when container holds multiple empty paragraphs', () => {
      const doc = schema.node('doc', null, [
        schema.node('container', null, [
          schema.node('paragraph'),
          schema.node('paragraph'),
        ]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when container holds a paragraph with only a hardBreak', () => {
      const doc = schema.node('doc', null, [
        schema.node('container', null, [
          schema.node('paragraph', null, [schema.node('hardBreak')]),
        ]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when container holds an image node', () => {
      const doc = schema.node('doc', null, [
        schema.node('container', null, [schema.node('image')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });
  });
});
