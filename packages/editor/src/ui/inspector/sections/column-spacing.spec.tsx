import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { ColumnSpacingSection } from './column-spacing';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('ColumnSpacingSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('renders for column-parent node types', () => {
    const ctx = buildInspectorContext({
      nodeType: 'twoColumns',
      attrs: { cellspacing: 8 },
    });
    const { container } = render(<ColumnSpacingSection {...ctx} />);
    expect(container.textContent).toContain('Column spacing');
  });

  it('renders nothing for non-column node types', () => {
    const ctx = buildInspectorContext({ nodeType: 'paragraph' });
    const { container } = render(<ColumnSpacingSection {...ctx} />);
    expect(container.textContent).not.toContain('Column spacing');
  });

  it('coerces empty / null / undefined cellspacing to 0', () => {
    const ctx = buildInspectorContext({
      nodeType: 'twoColumns',
      attrs: { cellspacing: undefined },
    });
    expect(() => render(<ColumnSpacingSection {...ctx} />)).not.toThrow();
  });

  it('cellspacing mutation goes through setAttr', () => {
    const ctx = buildInspectorContext({
      nodeType: 'threeColumns',
      attrs: { cellspacing: 0 },
    });
    render(<ColumnSpacingSection {...ctx} />);
    ctx.setAttr('cellspacing', 12);
    expect(ctx.attrs.cellspacing).toBe(12);
  });
});
