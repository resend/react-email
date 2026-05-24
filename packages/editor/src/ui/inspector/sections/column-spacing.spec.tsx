import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { ColumnSpacingSection } from './column-spacing';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('ColumnSpacingSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('renders for column-parent node types with current cellspacing', () => {
    const ctx = buildInspectorContext({
      nodeType: 'twoColumns',
      attrs: { cellspacing: 8 },
    });
    const { container } = render(<ColumnSpacingSection {...ctx} />);
    expect(container.textContent).toContain('Column spacing');
    const input = container.querySelector<HTMLInputElement>(
      'input[data-type="number"]',
    );
    expect(input?.value).toBe('8');
  });

  it('renders nothing for non-column node types', () => {
    const ctx = buildInspectorContext({ nodeType: 'paragraph' });
    const { container } = render(<ColumnSpacingSection {...ctx} />);
    expect(container.textContent).toBe('');
  });

  it.each([
    undefined,
    null,
    '',
  ])('shows 0 in the input when cellspacing is %p', (raw) => {
    const ctx = buildInspectorContext({
      nodeType: 'twoColumns',
      attrs: { cellspacing: raw as unknown },
    });
    const { container } = render(<ColumnSpacingSection {...ctx} />);
    const input = container.querySelector<HTMLInputElement>(
      'input[data-type="number"]',
    );
    expect(input?.value).toBe('0');
  });

  it('commits cellspacing via setAttr when the input blurs', () => {
    const ctx = buildInspectorContext({
      nodeType: 'threeColumns',
      attrs: { cellspacing: 0 },
    });
    const { container } = render(<ColumnSpacingSection {...ctx} />);
    const input = container.querySelector<HTMLInputElement>(
      'input[data-type="number"]',
    );
    expect(input).not.toBeNull();
    fireEvent.focus(input!);
    fireEvent.change(input!, { target: { value: '12' } });
    fireEvent.blur(input!);

    expect(ctx.setAttr).toHaveBeenCalledWith('cellspacing', 12);
    expect(ctx.attrs.cellspacing).toBe(12);
  });

  it('coerces an empty input back to 0 via setAttr', () => {
    const ctx = buildInspectorContext({
      nodeType: 'fourColumns',
      attrs: { cellspacing: 8 },
    });
    const { container } = render(<ColumnSpacingSection {...ctx} />);
    const input = container.querySelector<HTMLInputElement>(
      'input[data-type="number"]',
    );
    fireEvent.focus(input!);
    fireEvent.change(input!, { target: { value: '' } });
    fireEvent.blur(input!);

    expect(ctx.setAttr).toHaveBeenCalledWith('cellspacing', 0);
    expect(ctx.attrs.cellspacing).toBe(0);
  });
});
