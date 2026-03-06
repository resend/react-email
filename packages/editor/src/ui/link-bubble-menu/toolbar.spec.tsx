import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LinkBubbleMenuContext } from './context';
import { LinkBubbleMenuToolbar } from './toolbar';

const mockEditor = {} as any;

function renderWithContext(
  ui: ReactNode,
  { isEditing = false }: { isEditing?: boolean } = {},
) {
  return render(
    <LinkBubbleMenuContext.Provider
      value={{
        editor: mockEditor,
        linkHref: 'https://example.com',
        isEditing,
        setIsEditing: vi.fn(),
      }}
    >
      {ui}
    </LinkBubbleMenuContext.Provider>,
  );
}

describe('LinkBubbleMenuToolbar', () => {
  it('renders children when not editing', () => {
    renderWithContext(
      <LinkBubbleMenuToolbar>
        <button type="button">Edit</button>
      </LinkBubbleMenuToolbar>,
      { isEditing: false },
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeDefined();
  });

  it('renders null when editing', () => {
    const { container } = renderWithContext(
      <LinkBubbleMenuToolbar>
        <button type="button">Edit</button>
      </LinkBubbleMenuToolbar>,
      { isEditing: true },
    );
    expect(container.querySelector('[data-re-link-bm-toolbar]')).toBeNull();
  });

  it('spreads rest props onto div', () => {
    const { container } = renderWithContext(
      <LinkBubbleMenuToolbar data-testid="custom" aria-label="toolbar">
        <span>child</span>
      </LinkBubbleMenuToolbar>,
    );
    const toolbar = container.querySelector('[data-re-link-bm-toolbar]');
    expect(toolbar?.getAttribute('data-testid')).toBe('custom');
    expect(toolbar?.getAttribute('aria-label')).toBe('toolbar');
  });
});
