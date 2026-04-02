import { describe, expect, it } from 'vitest';
import type { EditorSnapshot } from '../config/text-config';
import { applyMarkToggles, textTypeValue } from './text-block-utils';

describe('textTypeValue', () => {
  it('returns "body" for paragraph nodes', () => {
    expect(textTypeValue('paragraph')).toBe('body');
  });

  it('returns "title" for heading level 1', () => {
    expect(textTypeValue('heading', 1)).toBe('title');
  });

  it('returns "subtitle" for heading level 2', () => {
    expect(textTypeValue('heading', 2)).toBe('subtitle');
  });

  it('returns "heading" for heading level 3', () => {
    expect(textTypeValue('heading', 3)).toBe('heading');
  });

  it('returns "body" for heading with unknown level', () => {
    expect(textTypeValue('heading', 4)).toBe('body');
    expect(textTypeValue('heading', 0)).toBe('body');
  });

  it('returns "body" for heading without a level', () => {
    expect(textTypeValue('heading')).toBe('body');
  });

  it('returns "body" for unknown node types', () => {
    expect(textTypeValue('blockquote')).toBe('body');
    expect(textTypeValue('image')).toBe('body');
    expect(textTypeValue('')).toBe('body');
  });
});

describe('applyMarkToggles', () => {
  const baseSnapshot: EditorSnapshot = {
    isBoldActive: false,
    isItalicActive: false,
    isUnderlineActive: false,
    isStrikeActive: false,
    isCodeActive: false,
    isUppercaseActive: false,
    isBulletListActive: false,
    isOrderedListActive: false,
    isBlockquoteActive: false,
    currentColor: undefined,
    parentBlock: {
      alignment: 'left',
      pos: 0,
      nodeType: 'paragraph',
      attrs: {},
    },
    blockStyle: {},
  };

  function createMockChain() {
    const called: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chain: any = {
      _called: called,
      toggleBold: () => {
        called.push('toggleBold');
        return chain;
      },
      toggleItalic: () => {
        called.push('toggleItalic');
        return chain;
      },
      toggleUnderline: () => {
        called.push('toggleUnderline');
        return chain;
      },
      toggleStrike: () => {
        called.push('toggleStrike');
        return chain;
      },
      toggleCode: () => {
        called.push('toggleCode');
        return chain;
      },
      toggleUppercase: () => {
        called.push('toggleUppercase');
        return chain;
      },
      toggleBlockquote: () => {
        called.push('toggleBlockquote');
        return chain;
      },
    };
    return chain;
  }

  it('toggles bold on when not active and requested', () => {
    const chain = createMockChain();
    applyMarkToggles(chain, ['bold'], baseSnapshot);
    expect(chain._called).toContain('toggleBold');
  });

  it('toggles bold off when active and not requested', () => {
    const chain = createMockChain();
    const state = { ...baseSnapshot, isBoldActive: true };
    applyMarkToggles(chain, [], state);
    expect(chain._called).toContain('toggleBold');
  });

  it('does not toggle bold when active and requested', () => {
    const chain = createMockChain();
    const state = { ...baseSnapshot, isBoldActive: true };
    applyMarkToggles(chain, ['bold'], state);
    expect(chain._called).not.toContain('toggleBold');
  });

  it('does not toggle bold when not active and not requested', () => {
    const chain = createMockChain();
    applyMarkToggles(chain, [], baseSnapshot);
    expect(chain._called).not.toContain('toggleBold');
  });

  it('toggles multiple marks at once', () => {
    const chain = createMockChain();
    applyMarkToggles(chain, ['bold', 'italic', 'code'], baseSnapshot);
    expect(chain._called).toContain('toggleBold');
    expect(chain._called).toContain('toggleItalic');
    expect(chain._called).toContain('toggleCode');
    expect(chain._called).not.toContain('toggleUnderline');
    expect(chain._called).not.toContain('toggleStrike');
    expect(chain._called).not.toContain('toggleBlockquote');
  });

  it('handles mixed active/requested state correctly', () => {
    const chain = createMockChain();
    const state: EditorSnapshot = {
      ...baseSnapshot,
      isBoldActive: true,
      isItalicActive: true,
      isUnderlineActive: false,
    };
    applyMarkToggles(chain, ['bold', 'underline'], state);
    expect(chain._called).not.toContain('toggleBold');
    expect(chain._called).toContain('toggleItalic');
    expect(chain._called).toContain('toggleUnderline');
  });

  it('handles line-through (strikethrough) mapping', () => {
    const chain = createMockChain();
    applyMarkToggles(chain, ['line-through'], baseSnapshot);
    expect(chain._called).toContain('toggleStrike');
  });

  it('returns the chain for continued chaining', () => {
    const chain = createMockChain();
    const result = applyMarkToggles(chain, ['bold'], baseSnapshot);
    expect(result).toBe(chain);
  });

  it('returns the chain even when no toggles are needed', () => {
    const chain = createMockChain();
    const result = applyMarkToggles(chain, [], baseSnapshot);
    expect(result).toBe(chain);
    expect(chain._called).toHaveLength(0);
  });

  it('handles blockquote toggle', () => {
    const chain = createMockChain();
    applyMarkToggles(chain, ['blockquote'], baseSnapshot);
    expect(chain._called).toContain('toggleBlockquote');
  });

  it('removes blockquote when active and not requested', () => {
    const chain = createMockChain();
    const state = { ...baseSnapshot, isBlockquoteActive: true };
    applyMarkToggles(chain, [], state);
    expect(chain._called).toContain('toggleBlockquote');
  });
});
