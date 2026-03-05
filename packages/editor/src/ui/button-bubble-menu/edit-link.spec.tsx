import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ButtonBubbleMenuContext } from './context';
import { ButtonBubbleMenuEditLink } from './edit-link';

const mockSetIsEditing = vi.fn();

function renderWithContext(ui: ReactNode) {
  return render(
    <ButtonBubbleMenuContext.Provider
      value={{
        editor: {} as any,
        isEditing: false,
        setIsEditing: mockSetIsEditing,
      }}
    >
      {ui}
    </ButtonBubbleMenuContext.Provider>,
  );
}

describe('ButtonBubbleMenuEditLink', () => {
  beforeEach(() => {
    mockSetIsEditing.mockClear();
  });

  it('renders a button with edit link aria-label', () => {
    renderWithContext(<ButtonBubbleMenuEditLink />);
    expect(screen.getByLabelText('Edit link')).toBeDefined();
  });

  it('calls setIsEditing(true) on click', () => {
    renderWithContext(<ButtonBubbleMenuEditLink />);
    fireEvent.click(screen.getByLabelText('Edit link'));
    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  it('prevents default on mousedown to avoid editor blur', () => {
    renderWithContext(<ButtonBubbleMenuEditLink />);
    const button = screen.getByLabelText('Edit link');
    const event = new MouseEvent('mousedown', { bubbles: true });
    const preventSpy = vi.spyOn(event, 'preventDefault');
    button.dispatchEvent(event);
    expect(preventSpy).toHaveBeenCalled();
  });

  it('renders custom children instead of default icon', () => {
    renderWithContext(
      <ButtonBubbleMenuEditLink>
        <span>Custom</span>
      </ButtonBubbleMenuEditLink>,
    );
    expect(screen.getByText('Custom')).toBeDefined();
  });

  it('applies className', () => {
    const { container } = renderWithContext(
      <ButtonBubbleMenuEditLink className="my-class" />,
    );
    expect(container.querySelector('[data-item="edit-link"]')?.className).toBe(
      'my-class',
    );
  });

  it('has correct data attributes', () => {
    const { container } = renderWithContext(<ButtonBubbleMenuEditLink />);
    const button = container.querySelector('[data-re-btn-bm-item]');
    expect(button).toBeDefined();
    expect(button?.getAttribute('data-item')).toBe('edit-link');
  });

  it('composes user onClick with setIsEditing', () => {
    const userOnClick = vi.fn();
    renderWithContext(<ButtonBubbleMenuEditLink onClick={userOnClick} />);
    fireEvent.click(screen.getByLabelText('Edit link'));
    expect(userOnClick).toHaveBeenCalledTimes(1);
    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  it('spreads rest props onto button', () => {
    renderWithContext(<ButtonBubbleMenuEditLink data-testid="custom" />);
    expect(screen.getByTestId('custom')).toBeDefined();
  });
});
