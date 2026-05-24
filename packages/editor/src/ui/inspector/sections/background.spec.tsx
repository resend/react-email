import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { BackgroundSection } from './background';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('BackgroundSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('renders the Background section with the current color', () => {
    const ctx = buildInspectorContext({
      styles: { backgroundColor: '#ffffff' },
    });
    const { container } = render(<BackgroundSection {...ctx} />);
    expect(container.textContent).toContain('Background');
    const hex = container.querySelector<HTMLInputElement>(
      '[data-re-inspector-color-hex]',
    );
    expect(hex?.value).toBe('#ffffff');
  });

  it('renders an empty hex value when backgroundColor is missing', () => {
    const ctx = buildInspectorContext({});
    const { container } = render(<BackgroundSection {...ctx} />);
    const hex = container.querySelector<HTMLInputElement>(
      '[data-re-inspector-color-hex]',
    );
    expect(hex?.value).toBe('');
  });

  it('typing into the hex input forwards the value to setStyle', () => {
    const ctx = buildInspectorContext({});
    const { container } = render(<BackgroundSection {...ctx} />);
    const hex = container.querySelector<HTMLInputElement>(
      '[data-re-inspector-color-hex]',
    );
    expect(hex).not.toBeNull();
    fireEvent.change(hex!, { target: { value: '#0670DB' } });
    expect(ctx.setStyle).toHaveBeenCalledWith('backgroundColor', '#0670DB');
    expect(ctx.styles.backgroundColor).toBe('#0670DB');
  });
});
