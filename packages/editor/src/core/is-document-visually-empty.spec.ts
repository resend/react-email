import { Schema } from '@tiptap/pm/model';
import { describe, expect, it } from 'vitest';
import { isDocumentVisuallyEmpty } from './is-document-visually-empty';

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'inline*' },
    text: { group: 'inline' },
    globalContent: { group: 'block', atom: true },
    image: { group: 'block', atom: true },
  },
});

describe('isDocumentVisuallyEmpty', () => {
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

  it('returns true when document contains multiple empty paragraphs', () => {
    const doc = schema.node('doc', null, [
      schema.node('paragraph'),
      schema.node('paragraph'),
    ]);

    expect(isDocumentVisuallyEmpty(doc)).toBe(true);
  });

  it('returns true when document contains only an image node', () => {
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
});
