import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LinkBubbleMenuContext } from './context';
import { LinkBubbleMenuForm } from './form';

const mockEditor = {
  chain: vi.fn(() => ({
    focus: vi.fn(() => ({
      unsetLink: vi.fn(() => ({ run: vi.fn() })),
      setLink: vi.fn(() => ({ run: vi.fn() })),
      extendMarkRange: vi.fn(() => ({
        setLink: vi.fn(() => ({
          setTextSelection: vi.fn(() => ({ run: vi.fn() })),
        })),
      })),
    })),
    unsetLink: vi.fn(() => ({ run: vi.fn() })),
    extendMarkRange: vi.fn(() => ({
      setLink: vi.fn(() => ({
        setTextSelection: vi.fn(() => ({ run: vi.fn() })),
      })),
    })),
    setLink: vi.fn(() => ({ run: vi.fn() })),
  })),
  state: { selection: { from: 0, to: 0 } },
  commands: { focus: vi.fn() },
  getAttributes: vi.fn(() => ({ href: 'https://example.com' })),
} as any;

function renderWithContext(
  ui: ReactNode,
  {
    isEditing = true,
    linkHref = 'https://example.com',
  }: { isEditing?: boolean; linkHref?: string } = {},
) {
  return render(
    <LinkBubbleMenuContext.Provider
      value={{
        editor: mockEditor,
        linkHref,
        isEditing,
        setIsEditing: vi.fn(),
      }}
    >
      {ui}
    </LinkBubbleMenuContext.Provider>,
  );
}

describe('LinkBubbleMenuForm', () => {
  it('renders null when not editing', () => {
    const { container } = renderWithContext(<LinkBubbleMenuForm />, {
      isEditing: false,
    });
    expect(container.querySelector('[data-re-link-bm-form]')).toBeNull();
  });

  it('renders form when editing', () => {
    renderWithContext(<LinkBubbleMenuForm />);
    expect(screen.getByPlaceholderText('Paste a link')).toBeDefined();
  });

  it('prefills input with current link href', () => {
    renderWithContext(<LinkBubbleMenuForm />, {
      linkHref: 'https://test.com',
    });
    const input = screen.getByPlaceholderText(
      'Paste a link',
    ) as HTMLInputElement;
    expect(input.value).toBe('https://test.com');
  });

  it('treats # href as empty', () => {
    renderWithContext(<LinkBubbleMenuForm />, { linkHref: '#' });
    const input = screen.getByPlaceholderText(
      'Paste a link',
    ) as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('shows unlink button when href exists', () => {
    renderWithContext(<LinkBubbleMenuForm />, {
      linkHref: 'https://example.com',
    });
    expect(screen.getByLabelText('Remove link')).toBeDefined();
  });

  it('shows apply button when no href', () => {
    renderWithContext(<LinkBubbleMenuForm />, { linkHref: '' });
    expect(screen.getByLabelText('Apply link')).toBeDefined();
  });

  it('renders children slot', () => {
    renderWithContext(
      <LinkBubbleMenuForm>
        <button type="button">Variables</button>
      </LinkBubbleMenuForm>,
    );
    expect(screen.getByRole('button', { name: 'Variables' })).toBeDefined();
  });

  it('applies className', () => {
    const { container } = renderWithContext(
      <LinkBubbleMenuForm className="custom-form" />,
    );
    expect(container.querySelector('[data-re-link-bm-form]')?.className).toBe(
      'custom-form',
    );
  });
});
