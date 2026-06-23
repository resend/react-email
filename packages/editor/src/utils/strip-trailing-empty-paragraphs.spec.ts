import type { JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vitest';
import { stripTrailingEmptyParagraphs } from './strip-trailing-empty-paragraphs';

describe('stripTrailingEmptyParagraphs', () => {
  it('removes trailing empty paragraph from container', () => {
    const input: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'container',
          content: [
            {
              type: 'button',
              attrs: { href: 'https://example.com' },
              content: [{ type: 'text', text: 'Click' }],
            },
            { type: 'paragraph' },
          ],
        },
      ],
    };

    const result = stripTrailingEmptyParagraphs(input);
    const container = result.content![0]!;
    expect(container.content).toHaveLength(1);
    expect(container.content![0]!.type).toBe('button');
  });

  it('removes trailing empty paragraph with empty content array', () => {
    const input: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'container',
          content: [
            {
              type: 'heading',
              content: [{ type: 'text', text: 'Title' }],
            },
            { type: 'paragraph', content: [] },
          ],
        },
      ],
    };

    const result = stripTrailingEmptyParagraphs(input);
    const container = result.content![0]!;
    expect(container.content).toHaveLength(1);
    expect(container.content![0]!.type).toBe('heading');
  });

  it('preserves trailing paragraph with content', () => {
    const input: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'container',
          content: [
            {
              type: 'button',
              attrs: { href: 'https://example.com' },
              content: [{ type: 'text', text: 'Click' }],
            },
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Some text' }],
            },
          ],
        },
      ],
    };

    const result = stripTrailingEmptyParagraphs(input);
    const container = result.content![0]!;
    expect(container.content).toHaveLength(2);
    expect(container.content![1]!.type).toBe('paragraph');
  });

  it('keeps single empty paragraph in container to avoid empty content', () => {
    const input: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'container',
          content: [{ type: 'paragraph' }],
        },
      ],
    };

    const result = stripTrailingEmptyParagraphs(input);
    const container = result.content![0]!;
    expect(container.content).toHaveLength(1);
    expect(container.content![0]!.type).toBe('paragraph');
  });

  it('does not strip trailing paragraph from non-container nodes', () => {
    const input: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'section',
          content: [
            {
              type: 'button',
              attrs: { href: 'https://example.com' },
              content: [{ type: 'text', text: 'Click' }],
            },
            { type: 'paragraph' },
          ],
        },
      ],
    };

    const result = stripTrailingEmptyParagraphs(input);
    const section = result.content![0]!;
    expect(section.content).toHaveLength(2);
  });

  it('handles nested containers', () => {
    const input: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'container',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Hello' }],
            },
            { type: 'paragraph' },
          ],
        },
      ],
    };

    const result = stripTrailingEmptyParagraphs(input);
    const container = result.content![0]!;
    expect(container.content).toHaveLength(1);
    expect(container.content![0]!.type).toBe('paragraph');
    expect(container.content![0]!.content![0]!.text).toBe('Hello');
  });

  it('handles doc with no content', () => {
    const input: JSONContent = { type: 'doc' };
    const result = stripTrailingEmptyParagraphs(input);
    expect(result).toEqual({ type: 'doc' });
  });

  it('handles doc with empty content array', () => {
    const input: JSONContent = { type: 'doc', content: [] };
    const result = stripTrailingEmptyParagraphs(input);
    expect(result).toEqual({ type: 'doc', content: [] });
  });

  it('does not strip non-trailing empty paragraphs from container', () => {
    const input: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'container',
          content: [
            { type: 'paragraph' },
            {
              type: 'button',
              attrs: { href: 'https://example.com' },
              content: [{ type: 'text', text: 'Click' }],
            },
          ],
        },
      ],
    };

    const result = stripTrailingEmptyParagraphs(input);
    const container = result.content![0]!;
    expect(container.content).toHaveLength(2);
    expect(container.content![0]!.type).toBe('paragraph');
    expect(container.content![1]!.type).toBe('button');
  });
});
