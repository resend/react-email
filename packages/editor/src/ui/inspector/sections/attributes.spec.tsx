import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildInspectorContext } from '../__tests__/context-helpers';
import { AttributesSection } from './attributes';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

describe('AttributesSection', () => {
  afterEach(() => vi.clearAllMocks());

  it('renders nothing when no visible attributes are present', () => {
    const ctx = buildInspectorContext({ nodeType: 'paragraph' });
    const { container } = render(<AttributesSection {...ctx} />);
    expect(container.textContent).toBe('');
  });

  it('does not throw on unknown node types', () => {
    const ctx = buildInspectorContext({ nodeType: 'unknownNodeType' });
    expect(() => render(<AttributesSection {...ctx} />)).not.toThrow();
  });
});
