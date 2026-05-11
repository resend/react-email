import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { BorderSection } from './border';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('BorderSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('renders with the current border styles wired to getStyle', () => {
    const ctx = buildInspectorContext({
      styles: {
        borderWidth: 2,
        borderColor: '#0670DB',
        borderStyle: 'solid',
        borderRadius: 4,
      },
    });
    const { container } = render(<BorderSection {...ctx} />);
    expect(container.textContent).toContain('Border');
  });

  it('per-side mutations dispatch only the changed side via batchSetStyle', () => {
    const ctx = buildInspectorContext({
      styles: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
      },
    });
    render(<BorderSection {...ctx} />);

    // Simulate the BorderPicker emitting a single-prop change (the picker
    // path that drives setStyle, not batchSetStyle, when only one prop
    // changes).
    ctx.setStyle('borderTopWidth', 4);

    expect(ctx.styles.borderTopWidth).toBe(4);
    expect(ctx.styles.borderRightWidth).toBe(1);
    expect(ctx.styles.borderBottomWidth).toBe(1);
    expect(ctx.styles.borderLeftWidth).toBe(1);
  });

  it('batched per-side changes update only the requested sides', () => {
    const ctx = buildInspectorContext({
      styles: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
      },
    });
    render(<BorderSection {...ctx} />);

    ctx.batchSetStyle([
      { prop: 'borderTopWidth', value: 2 },
      { prop: 'borderBottomWidth', value: 2 },
    ]);

    expect(ctx.styles.borderTopWidth).toBe(2);
    expect(ctx.styles.borderBottomWidth).toBe(2);
    expect(ctx.styles.borderRightWidth).toBe(1);
    expect(ctx.styles.borderLeftWidth).toBe(1);
  });

  it('borderRadius mutation goes through setStyle', () => {
    const ctx = buildInspectorContext({ styles: { borderRadius: 0 } });
    render(<BorderSection {...ctx} />);

    ctx.setStyle('borderRadius', 12);

    expect(ctx.setStyle).toHaveBeenCalledWith('borderRadius', 12);
    expect(ctx.styles.borderRadius).toBe(12);
  });
});
