import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LinkBubbleMenuContext } from './context';
import { LinkBubbleMenuEditLink } from './edit-link';

const mockSetIsEditing = vi.fn();

function renderWithContext(ui: ReactNode) {
  return render(
    <LinkBubbleMenuContext.Provider
      value={{
        editor: {} as any,
        linkHref: 'https://example.com',
        isEditing: false,
        setIsEditing: mockSetIsEditing,
      }}
    >
      {ui}
    </LinkBubbleMenuContext.Provider>,
  );
}

describe('LinkBubbleMenuEditLink', () => {
  beforeEach(() => {
    mockSetIsEditing.mockClear();
  });

  it('renders a button with edit link aria-label', () => {
    renderWithContext(<LinkBubbleMenuEditLink />);
    expect(screen.getByLabelText('Edit link')).toBeDefined();
  });

  it('calls setIsEditing(true) on click', () => {
    renderWithContext(<LinkBubbleMenuEditLink />);
    fireEvent.click(screen.getByLabelText('Edit link'));
    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  it('prevents default on mousedown to avoid editor blur', () => {
    renderWithContext(<LinkBubbleMenuEditLink />);
    const button = screen.getByLabelText('Edit link');
    const event = new MouseEvent('mousedown', { bubbles: true });
    const preventSpy = vi.spyOn(event, 'preventDefault');
    button.dispatchEvent(event);
    expect(preventSpy).toHaveBeenCalled();
  });

  it('renders custom children instead of default icon', () => {
    renderWithContext(
      <LinkBubbleMenuEditLink>
        <span>Custom</span>
      </LinkBubbleMenuEditLink>,
    );
    expect(screen.getByText('Custom')).toBeDefined();
  });

  it('applies className', () => {
    const { container } = renderWithContext(
      <LinkBubbleMenuEditLink className="my-class" />,
    );
    expect(container.querySelector('[data-item="edit-link"]')?.className).toBe(
      'my-class',
    );
  });

  it('has correct data attributes', () => {
    const { container } = renderWithContext(<LinkBubbleMenuEditLink />);
    const button = container.querySelector('[data-re-link-bm-item]');
    expect(button).toBeDefined();
    expect(button?.getAttribute('data-item')).toBe('edit-link');
  });

  it('composes user onClick with setIsEditing', () => {
    const userOnClick = vi.fn();
    renderWithContext(<LinkBubbleMenuEditLink onClick={userOnClick} />);
    fireEvent.click(screen.getByLabelText('Edit link'));
    expect(userOnClick).toHaveBeenCalledTimes(1);
    expect(mockSetIsEditing).toHaveBeenCalledWith(true);
  });

  it('spreads rest props onto button', () => {
    renderWithContext(<LinkBubbleMenuEditLink data-testid="custom" />);
    expect(screen.getByTestId('custom')).toBeDefined();
  });
});
