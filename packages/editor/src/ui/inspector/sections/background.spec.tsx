import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { BackgroundSection } from './background';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('BackgroundSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('reads backgroundColor and renders the section', () => {
    const ctx = buildInspectorContext({
      styles: { backgroundColor: '#ffffff' },
    });
    const { container } = render(<BackgroundSection {...ctx} />);
    expect(container.textContent).toContain('Background');
  });

  it('coerces missing backgroundColor to empty string without throwing', () => {
    const ctx = buildInspectorContext({});
    expect(() => render(<BackgroundSection {...ctx} />)).not.toThrow();
  });

  it('color mutation goes through setStyle', () => {
    const ctx = buildInspectorContext({});
    render(<BackgroundSection {...ctx} />);
    ctx.setStyle('backgroundColor', '#0670DB');
    expect(ctx.setStyle).toHaveBeenCalledWith('backgroundColor', '#0670DB');
    expect(ctx.styles.backgroundColor).toBe('#0670DB');
  });
});
