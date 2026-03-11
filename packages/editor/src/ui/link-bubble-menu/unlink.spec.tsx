import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LinkBubbleMenuContext } from './context';
import { LinkBubbleMenuUnlink } from './unlink';

const mockRun = vi.fn();
const mockUnsetLink = vi.fn(() => ({ run: mockRun }));
const mockFocus = vi.fn(() => ({ unsetLink: mockUnsetLink }));
const mockChain = vi.fn(() => ({ focus: mockFocus }));
const mockEditor = { chain: mockChain } as any;

function renderWithContext(ui: ReactNode) {
  return render(
    <LinkBubbleMenuContext.Provider
      value={{
        editor: mockEditor,
        linkHref: 'https://example.com',
        isEditing: false,
        setIsEditing: vi.fn(),
      }}
    >
      {ui}
    </LinkBubbleMenuContext.Provider>,
  );
}

describe('LinkBubbleMenuUnlink', () => {
  beforeEach(() => {
    mockChain.mockClear();
    mockFocus.mockClear();
    mockUnsetLink.mockClear();
    mockRun.mockClear();
  });

  it('renders a button with remove link aria-label', () => {
    renderWithContext(<LinkBubbleMenuUnlink />);
    expect(screen.getByLabelText('Remove link')).toBeDefined();
  });

  it('calls editor.chain().focus().unsetLink().run() on click', () => {
    renderWithContext(<LinkBubbleMenuUnlink />);
    fireEvent.click(screen.getByLabelText('Remove link'));
    expect(mockChain).toHaveBeenCalled();
    expect(mockFocus).toHaveBeenCalled();
    expect(mockUnsetLink).toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalled();
  });

  it('renders custom children instead of default icon', () => {
    renderWithContext(
      <LinkBubbleMenuUnlink>
        <span>Remove</span>
      </LinkBubbleMenuUnlink>,
    );
    expect(screen.getByText('Remove')).toBeDefined();
  });

  it('applies className', () => {
    const { container } = renderWithContext(
      <LinkBubbleMenuUnlink className="my-class" />,
    );
    expect(container.querySelector('[data-item="unlink"]')?.className).toBe(
      'my-class',
    );
  });

  it('has correct data attributes', () => {
    const { container } = renderWithContext(<LinkBubbleMenuUnlink />);
    const button = container.querySelector('[data-re-link-bm-item]');
    expect(button).toBeDefined();
    expect(button?.getAttribute('data-item')).toBe('unlink');
  });

  it('composes user onClick with unsetLink', () => {
    const userOnClick = vi.fn();
    renderWithContext(<LinkBubbleMenuUnlink onClick={userOnClick} />);
    fireEvent.click(screen.getByLabelText('Remove link'));
    expect(userOnClick).toHaveBeenCalledTimes(1);
    expect(mockChain).toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalled();
  });

  it('spreads rest props onto button', () => {
    renderWithContext(<LinkBubbleMenuUnlink data-testid="custom" />);
    expect(screen.getByTestId('custom')).toBeDefined();
  });
});
