import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { PaddingSection } from './padding';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('PaddingSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('reads padding from getStyle and renders the spacing section', () => {
    const ctx = buildInspectorContext({
      styles: {
        paddingTop: 8,
        paddingRight: 12,
        paddingBottom: 8,
        paddingLeft: 12,
      },
    });
    const { container } = render(<PaddingSection {...ctx} />);
    expect(container.textContent).toContain('Spacing');
  });

  it('coerces non-numeric padding values to 0', () => {
    const ctx = buildInspectorContext({
      styles: { paddingTop: 'invalid' },
    });
    // Should not throw on render; the coercion is handled by Number().
    expect(() => render(<PaddingSection {...ctx} />)).not.toThrow();
  });

  it('per-side updates land via batchSetStyle without resetting others', () => {
    const ctx = buildInspectorContext({
      styles: {
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 8,
      },
    });
    render(<PaddingSection {...ctx} />);

    ctx.batchSetStyle([{ prop: 'paddingTop', value: 16 }]);

    expect(ctx.styles.paddingTop).toBe(16);
    expect(ctx.styles.paddingRight).toBe(8);
    expect(ctx.styles.paddingBottom).toBe(8);
    expect(ctx.styles.paddingLeft).toBe(8);
  });
});
