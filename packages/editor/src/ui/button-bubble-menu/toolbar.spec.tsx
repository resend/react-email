import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ButtonBubbleMenuContext } from './context.js';
import { ButtonBubbleMenuToolbar } from './toolbar.js';

const mockEditor = {} as any;

function renderWithContext(
  ui: ReactNode,
  { isEditing = false }: { isEditing?: boolean } = {},
) {
  return render(
    <ButtonBubbleMenuContext.Provider
      value={{
        editor: mockEditor,
        isEditing,
        setIsEditing: vi.fn(),
      }}
    >
      {ui}
    </ButtonBubbleMenuContext.Provider>,
  );
}

describe('ButtonBubbleMenuToolbar', () => {
  it('renders children when not editing', () => {
    renderWithContext(
      <ButtonBubbleMenuToolbar>
        <button type="button">Edit</button>
      </ButtonBubbleMenuToolbar>,
      { isEditing: false },
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeDefined();
  });

  it('renders null when editing', () => {
    const { container } = renderWithContext(
      <ButtonBubbleMenuToolbar>
        <button type="button">Edit</button>
      </ButtonBubbleMenuToolbar>,
      { isEditing: true },
    );
    expect(container.querySelector('[data-re-btn-bm-toolbar]')).toBeNull();
  });

  it('spreads rest props onto div', () => {
    const { container } = renderWithContext(
      <ButtonBubbleMenuToolbar data-testid="custom" aria-label="toolbar">
        <span>child</span>
      </ButtonBubbleMenuToolbar>,
    );
    const toolbar = container.querySelector('[data-re-btn-bm-toolbar]');
    expect(toolbar?.getAttribute('data-testid')).toBe('custom');
    expect(toolbar?.getAttribute('aria-label')).toBe('toolbar');
  });
});
