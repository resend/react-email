import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { BorderSection } from './border';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('BorderSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('renders the Border title with current uniform values', () => {
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
    const widthInput = container.querySelector<HTMLInputElement>(
      'input[data-type="number"]',
    );
    expect(widthInput?.value).toBe('2');
  });

  it('commits a uniform borderWidth change via setStyle when the input blurs', () => {
    const ctx = buildInspectorContext({
      styles: {
        borderWidth: 0,
        borderColor: '#000000',
        borderStyle: 'solid',
      },
    });
    const { container } = render(<BorderSection {...ctx} />);
    const widthInput = container.querySelector<HTMLInputElement>(
      'input[data-type="number"]',
    );
    fireEvent.focus(widthInput!);
    fireEvent.change(widthInput!, { target: { value: '3' } });
    fireEvent.blur(widthInput!);

    expect(ctx.setStyle).toHaveBeenCalledWith('borderWidth', 3);
    expect(ctx.styles.borderWidth).toBe(3);
  });

  it('commits a uniform borderColor change via setStyle from the hex input', () => {
    const ctx = buildInspectorContext({
      styles: {
        borderWidth: 1,
        borderColor: '#000000',
        borderStyle: 'solid',
      },
    });
    const { container } = render(<BorderSection {...ctx} />);
    const hex = container.querySelector<HTMLInputElement>(
      '[data-re-inspector-color-hex]',
    );
    fireEvent.change(hex!, { target: { value: '#0670DB' } });

    expect(ctx.setStyle).toHaveBeenCalledWith('borderColor', '#0670DB');
    expect(ctx.styles.borderColor).toBe('#0670DB');
  });

  it('per-side mutation does not reset the other three sides', () => {
    const ctx = buildInspectorContext({
      styles: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: '#000000',
        borderRightColor: '#000000',
        borderBottomColor: '#000000',
        borderLeftColor: '#000000',
        borderTopStyle: 'solid',
        borderRightStyle: 'solid',
        borderBottomStyle: 'solid',
        borderLeftStyle: 'solid',
        // styles differ so per-side mode auto-activates
        borderTopWidth_marker: 'mixed',
      },
    });
    // Mismatch to force individual mode:
    ctx.styles.borderTopWidth = 1;
    ctx.styles.borderRightWidth = 2;

    const { container } = render(<BorderSection {...ctx} />);
    const widthInputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[data-type="number"]'),
    );
    expect(widthInputs.length).toBeGreaterThanOrEqual(4);

    fireEvent.focus(widthInputs[0]);
    fireEvent.change(widthInputs[0], { target: { value: '6' } });
    fireEvent.blur(widthInputs[0]);

    expect(ctx.styles.borderTopWidth).toBe(6);
    expect(ctx.styles.borderRightWidth).toBe(2);
    expect(ctx.styles.borderBottomWidth).toBe(1);
    expect(ctx.styles.borderLeftWidth).toBe(1);
  });

  it('commits borderRadius via setStyle when the radius input blurs', () => {
    const ctx = buildInspectorContext({ styles: { borderRadius: 0 } });
    const { container } = render(<BorderSection {...ctx} />);
    const numberInputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[data-type="number"]'),
    );
    // The last numeric input belongs to BorderRadiusPicker.
    const radiusInput = numberInputs[numberInputs.length - 1];
    fireEvent.focus(radiusInput);
    fireEvent.change(radiusInput, { target: { value: '12' } });
    fireEvent.blur(radiusInput);

    expect(ctx.setStyle).toHaveBeenCalledWith('borderRadius', '12px');
    expect(ctx.styles.borderRadius).toBe('12px');
  });
});
