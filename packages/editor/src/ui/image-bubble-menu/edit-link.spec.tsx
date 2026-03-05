import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ImageBubbleMenuContext } from './context';
import { ImageBubbleMenuEditLink } from './edit-link';

const mockSetIsEditing = vi.fn();

function renderWithContext(ui: ReactNode) {
  return render(
    <ImageBubbleMenuContext.Provider
      value={{
        editor: {} as any,
        isEditing: false,
        setIsEditing: mockSetIsEditing,
      }}
    >
      {ui}
    </ImageBubbleMenuContext.Provider>,
  );
}

describe('ImageBubbleMenuEditLink', () => {
  beforeEach(() => {
    mockSetIsEditing.mockClear();
  });

  it('renders a button with edit link aria-label', () => {
    renderWithContext(<ImageBubbleMenuEditLink />);
    expect(screen.getByLabelText('Edit link')).toBeDefined();
  });

  it('calls setIsEditing(true) on click', () => {
    renderWithContext(<ImageBubbleMenuEditLink />);
    fireEvent.click(screen.getByLabelText('Edit link'));
    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  it('prevents default on mousedown to avoid editor blur', () => {
    renderWithContext(<ImageBubbleMenuEditLink />);
    const button = screen.getByLabelText('Edit link');
    const event = new MouseEvent('mousedown', { bubbles: true });
    const preventSpy = vi.spyOn(event, 'preventDefault');
    button.dispatchEvent(event);
    expect(preventSpy).toHaveBeenCalled();
  });

  it('composes user onMouseDown while still preventing default', () => {
    const userOnMouseDown = vi.fn();
    renderWithContext(
      <ImageBubbleMenuEditLink onMouseDown={userOnMouseDown} />,
    );
    const button = screen.getByLabelText('Edit link');
    const event = new MouseEvent('mousedown', { bubbles: true });
    const preventSpy = vi.spyOn(event, 'preventDefault');
    button.dispatchEvent(event);
    expect(preventSpy).toHaveBeenCalled();
    expect(userOnMouseDown).toHaveBeenCalledTimes(1);
  });

  it('renders custom children instead of default icon', () => {
    renderWithContext(
      <ImageBubbleMenuEditLink>
        <span>Custom</span>
      </ImageBubbleMenuEditLink>,
    );
    expect(screen.getByText('Custom')).toBeDefined();
  });

  it('applies className', () => {
    const { container } = renderWithContext(
      <ImageBubbleMenuEditLink className="my-class" />,
    );
    expect(container.querySelector('[data-item="edit-link"]')?.className).toBe(
      'my-class',
    );
  });

  it('has correct data attributes', () => {
    const { container } = renderWithContext(<ImageBubbleMenuEditLink />);
    const button = container.querySelector('[data-re-img-bm-item]');
    expect(button).toBeDefined();
    expect(button?.getAttribute('data-item')).toBe('edit-link');
  });

  it('composes user onClick with setIsEditing', () => {
    const userOnClick = vi.fn();
    renderWithContext(<ImageBubbleMenuEditLink onClick={userOnClick} />);
    fireEvent.click(screen.getByLabelText('Edit link'));
    expect(userOnClick).toHaveBeenCalledTimes(1);
    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  it('spreads rest props onto button', () => {
    renderWithContext(<ImageBubbleMenuEditLink data-testid="custom" />);
    expect(screen.getByTestId('custom')).toBeDefined();
  });
});
