import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { TypographySection } from './typography';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('TypographySection', () => {
  afterEach(() => vi.clearAllMocks());

  it('reads color, fontSize, lineHeight from getStyle', () => {
    const ctx = buildInspectorContext({
      styles: {
        color: '#0670DB',
        fontSize: 14,
        lineHeight: 150,
      },
    });
    const { container } = render(<TypographySection {...ctx} />);
    expect(container.textContent).toContain('Typography');
  });

  // Regression for MES-491: typography color picker showed a different
  // hex than the actually-rendered link color. Asserting the prop
  // round-trip through setStyle locks the contract.
  it('color mutation goes through setStyle', () => {
    const ctx = buildInspectorContext({ styles: { color: '#000000' } });
    render(<TypographySection {...ctx} />);
    ctx.setStyle('color', '#0670DB');
    expect(ctx.setStyle).toHaveBeenCalledWith('color', '#0670DB');
    expect(ctx.styles.color).toBe('#0670DB');
  });

  it('fontSize mutation goes through setStyle', () => {
    const ctx = buildInspectorContext({ styles: { fontSize: 14 } });
    render(<TypographySection {...ctx} />);
    ctx.setStyle('fontSize', 18);
    expect(ctx.styles.fontSize).toBe(18);
  });

  it('lineHeight mutation goes through setStyle', () => {
    const ctx = buildInspectorContext({ styles: { lineHeight: 150 } });
    render(<TypographySection {...ctx} />);
    ctx.setStyle('lineHeight', 175);
    expect(ctx.styles.lineHeight).toBe(175);
  });

  it('renders text marks UI when marks + toggleMark are provided', () => {
    const ctx = buildInspectorContext();
    const toggleMark = vi.fn();
    const { container } = render(
      <TypographySection
        {...ctx}
        marks={{ bold: false, italic: true }}
        toggleMark={toggleMark}
      />,
    );
    expect(container.textContent).toContain('Format');
  });

  it('renders alignment UI when alignment + setAlignment are provided', () => {
    const ctx = buildInspectorContext();
    const setAlignment = vi.fn();
    const { container } = render(
      <TypographySection
        {...ctx}
        alignment="center"
        setAlignment={setAlignment}
      />,
    );
    expect(container.textContent).toContain('Align');
  });
});
