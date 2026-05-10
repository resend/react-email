import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { SizeSection } from './size';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('SizeSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('reads width/height from styles for non-image nodes', () => {
    const ctx = buildInspectorContext({
      nodeType: 'paragraph',
      styles: { width: 200, height: 100 },
    });
    const { container } = render(<SizeSection {...ctx} />);
    expect(container.textContent).toContain('Size');
  });

  it('reads width/height from attrs for image nodes', () => {
    const ctx = buildInspectorContext({
      nodeType: 'image',
      attrs: { width: 320, height: 240 },
    });
    expect(() => render(<SizeSection {...ctx} />)).not.toThrow();
  });

  it('routes width changes to setStyle for non-image nodes', () => {
    const ctx = buildInspectorContext({ nodeType: 'paragraph' });
    render(<SizeSection {...ctx} />);
    ctx.setStyle('width', 320);
    expect(ctx.styles.width).toBe(320);
    expect(ctx.attrs.width).toBeUndefined();
  });

  it('routes width changes to setAttr for image nodes', () => {
    const ctx = buildInspectorContext({ nodeType: 'image' });
    render(<SizeSection {...ctx} />);
    ctx.setAttr('width', 320);
    expect(ctx.attrs.width).toBe(320);
    expect(ctx.styles.width).toBeUndefined();
  });
});
