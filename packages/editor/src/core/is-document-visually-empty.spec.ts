import { Schema } from '@tiptap/pm/model';
import { describe, expect, it } from 'vitest';
import { isDocumentVisuallyEmpty } from './is-document-visually-empty';

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'inline*' },
    heading: {
      group: 'block',
      content: 'inline*',
      attrs: { level: { default: 1 } },
    },
    text: { group: 'inline' },
    globalContent: { group: 'block', atom: true },
    container: { group: 'block', content: 'block+' },
    image: { group: 'block', atom: true },
    variable: { group: 'inline', inline: true, atom: true },
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

    it('considers just white spaces as not empty', () => {
      const doc = schema.node('doc', null, [
        schema.node('paragraph', null, [schema.text('                 ')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when paragraph contains only an inline atom node', () => {
      const doc = schema.node('doc', null, [
        schema.node('paragraph', null, [schema.node('variable')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when paragraph contains an inline atom node and text', () => {
      const doc = schema.node('doc', null, [
        schema.node('paragraph', null, [
          schema.node('variable'),
          schema.text(' '),
        ]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    // Empty headings used to render the placeholder predicate as non-empty,
    // which broke the "Press / for commands" hint when the doc started as
    // a heading. See email-editor.tsx:153 TODO.
    it('returns true when document contains a single empty heading', () => {
      const doc = schema.node('doc', null, [schema.node('heading')]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(true);
    });

    it('returns true when global content precedes a single empty heading', () => {
      const doc = schema.node('doc', null, [
        schema.node('globalContent'),
        schema.node('heading'),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(true);
    });

    it('returns false when heading has text', () => {
      const doc = schema.node('doc', null, [
        schema.node('heading', null, [schema.text('title')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when heading contains a variable node', () => {
      const doc = schema.node('doc', null, [
        schema.node('heading', null, [schema.node('variable')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when document has an empty heading and a variable paragraph', () => {
      const doc = schema.node('doc', null, [
        schema.node('heading'),
        schema.node('paragraph', null, [schema.node('variable')]),
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

    it('returns false when container holds an image node', () => {
      const doc = schema.node('doc', null, [
        schema.node('container', null, [schema.node('image')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns false when container paragraph contains only an inline atom node', () => {
      const doc = schema.node('doc', null, [
        schema.node('container', null, [
          schema.node('paragraph', null, [schema.node('variable')]),
        ]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });

    it('returns true when container holds one empty heading', () => {
      const doc = schema.node('doc', null, [
        schema.node('container', null, [schema.node('heading')]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(true);
    });

    it('returns false when container holds heading with text', () => {
      const doc = schema.node('doc', null, [
        schema.node('container', null, [
          schema.node('heading', null, [schema.text('hi')]),
        ]),
      ]);

      expect(isDocumentVisuallyEmpty(doc)).toBe(false);
    });
  });
});
