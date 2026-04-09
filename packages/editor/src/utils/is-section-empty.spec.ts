import { Schema } from '@tiptap/pm/model';
import { describe, expect, it } from 'vitest';
import { isSectionEmpty } from './is-section-empty';

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    section: { group: 'block', content: 'block+' },
    paragraph: { group: 'block', content: 'inline*' },
    text: { group: 'inline' },
    horizontalRule: { group: 'block' },
    image: { group: 'block', atom: true },
  },
});

const section = (children: Parameters<typeof schema.node>[2]) =>
  schema.node('section', null, children);

describe('isSectionEmpty', () => {
  it('returns true for a section with a single empty paragraph', () => {
    const node = section([schema.node('paragraph')]);
    expect(isSectionEmpty(node)).toBe(true);
  });

  it('returns true for a section with multiple empty paragraphs', () => {
    const node = section([
      schema.node('paragraph'),
      schema.node('paragraph'),
    ]);
    expect(isSectionEmpty(node)).toBe(true);
  });

  it('returns false for a section with a paragraph containing text', () => {
    const node = section([
      schema.node('paragraph', null, [schema.text('hello')]),
    ]);
    expect(isSectionEmpty(node)).toBe(false);
  });

  it('returns false for a section containing a horizontal rule', () => {
    const node = section([schema.node('horizontalRule')]);
    expect(isSectionEmpty(node)).toBe(false);
  });

  it('returns false for a section containing an atom node', () => {
    const node = section([schema.node('image')]);
    expect(isSectionEmpty(node)).toBe(false);
  });

  it('returns false for a section with a horizontal rule and an empty paragraph', () => {
    const node = section([
      schema.node('horizontalRule'),
      schema.node('paragraph'),
    ]);
    expect(isSectionEmpty(node)).toBe(false);
  });

  it('returns false for a section with an atom node and text', () => {
    const node = section([
      schema.node('image'),
      schema.node('paragraph', null, [schema.text('caption')]),
    ]);
    expect(isSectionEmpty(node)).toBe(false);
  });
});
