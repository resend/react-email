import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ImageBubbleMenuContext } from './context.js';
import { ImageBubbleMenuToolbar } from './toolbar.js';

const mockEditor = {} as any;

function renderWithContext(
  ui: ReactNode,
  { isEditing = false }: { isEditing?: boolean } = {},
) {
  return render(
    <ImageBubbleMenuContext.Provider
      value={{
        editor: mockEditor,
        isEditing,
        setIsEditing: vi.fn(),
      }}
    >
      {ui}
    </ImageBubbleMenuContext.Provider>,
  );
}

describe('ImageBubbleMenuToolbar', () => {
  it('renders children when not editing', () => {
    renderWithContext(
      <ImageBubbleMenuToolbar>
        <button type="button">Edit</button>
      </ImageBubbleMenuToolbar>,
      { isEditing: false },
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeDefined();
  });

  it('renders null when editing', () => {
    const { container } = renderWithContext(
      <ImageBubbleMenuToolbar>
        <button type="button">Edit</button>
      </ImageBubbleMenuToolbar>,
      { isEditing: true },
    );
    expect(container.querySelector('[data-re-img-bm-toolbar]')).toBeNull();
  });

  it('spreads rest props onto div', () => {
    const { container } = renderWithContext(
      <ImageBubbleMenuToolbar data-testid="custom" aria-label="toolbar">
        <span>child</span>
      </ImageBubbleMenuToolbar>,
    );
    const toolbar = container.querySelector('[data-re-img-bm-toolbar]');
    expect(toolbar?.getAttribute('data-testid')).toBe('custom');
    expect(toolbar?.getAttribute('aria-label')).toBe('toolbar');
  });
});
