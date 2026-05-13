import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { PaddingSection } from './padding';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('PaddingSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('renders the Spacing section title', () => {
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

  it('shows the current padding values in the inputs', () => {
    const ctx = buildInspectorContext({
      styles: {
        paddingTop: 16,
        paddingRight: 4,
        paddingBottom: 16,
        paddingLeft: 4,
      },
    });
    const { container } = render(<PaddingSection {...ctx} />);
    const inputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[data-type="number"]'),
    );
    const values = inputs.map((i) => i.value);
    expect(values).toEqual(expect.arrayContaining(['16', '4']));
  });

  it('coerces non-numeric padding to 0 in the rendered input', () => {
    const ctx = buildInspectorContext({
      styles: { paddingTop: 'invalid' },
    });
    const { container } = render(<PaddingSection {...ctx} />);
    const inputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[data-type="number"]'),
    );
    expect(inputs.every((i) => i.value === '0')).toBe(true);
  });

  it('updates all four sides when in uniform mode (all values equal)', () => {
    const ctx = buildInspectorContext({
      styles: {
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 8,
      },
    });
    const { container } = render(<PaddingSection {...ctx} />);
    const input = container.querySelector<HTMLInputElement>(
      'input[data-type="number"]',
    );
    expect(input).not.toBeNull();
    fireEvent.focus(input!);
    fireEvent.change(input!, { target: { value: '16' } });
    fireEvent.blur(input!);

    expect(ctx.styles.paddingTop).toBe(16);
    expect(ctx.styles.paddingRight).toBe(16);
    expect(ctx.styles.paddingBottom).toBe(16);
    expect(ctx.styles.paddingLeft).toBe(16);
  });

  it('updates only the changed side when sides are individually set', () => {
    const ctx = buildInspectorContext({
      styles: {
        paddingTop: 8,
        paddingRight: 4,
        paddingBottom: 8,
        paddingLeft: 4,
      },
    });
    const { container } = render(<PaddingSection {...ctx} />);
    const inputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[data-type="number"]'),
    );
    expect(inputs.length).toBe(4);
    fireEvent.focus(inputs[0]);
    fireEvent.change(inputs[0], { target: { value: '24' } });
    fireEvent.blur(inputs[0]);

    expect(ctx.styles.paddingTop).toBe(24);
    expect(ctx.styles.paddingRight).toBe(4);
    expect(ctx.styles.paddingBottom).toBe(8);
    expect(ctx.styles.paddingLeft).toBe(4);
  });
});
