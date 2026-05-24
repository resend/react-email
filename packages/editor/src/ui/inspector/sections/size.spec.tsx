import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { SizeSection } from './size';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('SizeSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('shows width/height read from styles for non-image nodes', () => {
    const ctx = buildInspectorContext({
      nodeType: 'paragraph',
      styles: { width: 200, height: 100 },
    });
    const { container } = render(<SizeSection {...ctx} />);
    const inputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[data-type="number"]'),
    );
    expect(inputs.map((i) => i.value)).toEqual(['200', '100']);
  });

  it('shows width/height read from attrs for image nodes', () => {
    const ctx = buildInspectorContext({
      nodeType: 'image',
      attrs: { width: 320, height: 240 },
    });
    const { container } = render(<SizeSection {...ctx} />);
    const inputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[data-type="number"]'),
    );
    expect(inputs.map((i) => i.value)).toEqual(['320', '240']);
  });

  it('commits width changes via setStyle for non-image nodes', () => {
    const ctx = buildInspectorContext({
      nodeType: 'paragraph',
      styles: { width: 200 },
    });
    const { container } = render(<SizeSection {...ctx} />);
    const widthInput = container.querySelector<HTMLInputElement>(
      'input[data-type="number"]',
    );
    fireEvent.focus(widthInput!);
    fireEvent.change(widthInput!, { target: { value: '320' } });
    fireEvent.blur(widthInput!);

    expect(ctx.setStyle).toHaveBeenCalledWith('width', 320);
    expect(ctx.styles.width).toBe(320);
    expect(ctx.attrs.width).toBeUndefined();
  });

  it('commits width changes via setAttr for image nodes', () => {
    const ctx = buildInspectorContext({
      nodeType: 'image',
      attrs: { width: 200 },
    });
    const { container } = render(<SizeSection {...ctx} />);
    const widthInput = container.querySelector<HTMLInputElement>(
      'input[data-type="number"]',
    );
    fireEvent.focus(widthInput!);
    fireEvent.change(widthInput!, { target: { value: '480' } });
    fireEvent.blur(widthInput!);

    expect(ctx.setAttr).toHaveBeenCalledWith('width', 480);
    expect(ctx.attrs.width).toBe(480);
  });
});
