import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LinkBubbleMenuContext } from './context';
import { LinkBubbleMenuOpenLink } from './open-link';

function renderWithContext(
  ui: ReactNode,
  { linkHref = 'https://example.com' }: { linkHref?: string } = {},
) {
  return render(
    <LinkBubbleMenuContext.Provider
      value={{
        editor: {} as any,
        linkHref,
        isEditing: false,
        setIsEditing: vi.fn(),
      }}
    >
      {ui}
    </LinkBubbleMenuContext.Provider>,
  );
}

describe('LinkBubbleMenuOpenLink', () => {
  it('renders an anchor with correct href', () => {
    renderWithContext(<LinkBubbleMenuOpenLink />);
    const link = screen.getByLabelText('Open link') as HTMLAnchorElement;
    expect(link.tagName).toBe('A');
    expect(link.href).toBe('https://example.com/');
  });

  it('opens in new tab with noopener noreferrer', () => {
    renderWithContext(<LinkBubbleMenuOpenLink />);
    const link = screen.getByLabelText('Open link') as HTMLAnchorElement;
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');
  });

  it('updates href when context linkHref changes', () => {
    const { rerender } = renderWithContext(<LinkBubbleMenuOpenLink />);
    expect(
      (screen.getByLabelText('Open link') as HTMLAnchorElement).href,
    ).toBe('https://example.com/');

    rerender(
      <LinkBubbleMenuContext.Provider
        value={{
          editor: {} as any,
          linkHref: 'https://other.com',
          isEditing: false,
          setIsEditing: vi.fn(),
        }}
      >
        <LinkBubbleMenuOpenLink />
      </LinkBubbleMenuContext.Provider>,
    );
    expect(
      (screen.getByLabelText('Open link') as HTMLAnchorElement).href,
    ).toBe('https://other.com/');
  });

  it('renders custom children instead of default icon', () => {
    renderWithContext(
      <LinkBubbleMenuOpenLink>
        <span>Open</span>
      </LinkBubbleMenuOpenLink>,
    );
    expect(screen.getByText('Open')).toBeDefined();
  });

  it('applies className', () => {
    const { container } = renderWithContext(
      <LinkBubbleMenuOpenLink className="my-class" />,
    );
    expect(container.querySelector('[data-item="open-link"]')?.className).toBe(
      'my-class',
    );
  });

  it('has correct data attributes', () => {
    const { container } = renderWithContext(<LinkBubbleMenuOpenLink />);
    const link = container.querySelector('[data-re-link-bm-item]');
    expect(link).toBeDefined();
    expect(link?.getAttribute('data-item')).toBe('open-link');
  });
});
