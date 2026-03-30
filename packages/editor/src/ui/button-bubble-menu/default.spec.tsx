import { cleanup, render, screen } from '@testing-library/react';
import { ButtonBubbleMenuDefault } from './default';

const mockEditor = {
  isActive: vi.fn().mockReturnValue(false),
  getAttributes: vi.fn().mockReturnValue({ href: '#' }),
  view: {
    dom: { classList: { contains: vi.fn().mockReturnValue(false) } },
  },
  on: vi.fn(),
  off: vi.fn(),
};

vi.mock('@tiptap/react', () => ({
  useCurrentEditor: () => ({ editor: mockEditor }),
  useEditorState: ({
    selector,
  }: {
    selector: (ctx: { editor: unknown }) => unknown;
  }) => selector({ editor: mockEditor }),
}));

let capturedOnHide: (() => void) | undefined;
let capturedShouldShow:
  | ((ctx: { editor: typeof mockEditor; view: unknown }) => boolean)
  | undefined;

vi.mock('@tiptap/react/menus', () => ({
  BubbleMenu: ({
    children,
    className,
    options,
    shouldShow,
  }: {
    children: React.ReactNode;
    className?: string;
    options?: { placement?: string; offset?: number; onHide?: () => void };
    shouldShow?: (ctx: { editor: unknown; view: unknown }) => boolean;
  }) => {
    capturedOnHide = options?.onHide;
    capturedShouldShow = shouldShow as typeof capturedShouldShow;
    return (
      <div
        data-testid="bubble-menu-root"
        data-placement={options?.placement}
        data-offset={options?.offset}
        className={className}
      >
        {children}
      </div>
    );
  },
}));

afterEach(() => {
  cleanup();
  mockEditor.isActive.mockReturnValue(false);
  capturedOnHide = undefined;
  capturedShouldShow = undefined;
});

describe('ButtonBubbleMenuDefault', () => {
  it('renders EditLink by default', () => {
    render(<ButtonBubbleMenuDefault />);

    expect(screen.getByLabelText('Edit link')).toBeDefined();
    expect(document.querySelector('[data-re-btn-bm-toolbar]')).toBeDefined();
  });

  it('shows unlink button when button has a link', () => {
    mockEditor.getAttributes.mockReturnValue({ href: 'https://react.email' });
    render(<ButtonBubbleMenuDefault />);

    expect(screen.getByLabelText('Remove link')).toBeDefined();
    mockEditor.getAttributes.mockReturnValue({ href: '#' });
  });

  it('forwards placement and offset to Root', () => {
    render(<ButtonBubbleMenuDefault placement="bottom" offset={16} />);

    const root = screen.getByTestId('bubble-menu-root');
    expect(root.dataset.placement).toBe('bottom');
    expect(root.dataset.offset).toBe('16');
  });

  it('applies className to the root element', () => {
    render(<ButtonBubbleMenuDefault className="custom" />);

    const root = screen.getByTestId('bubble-menu-root');
    expect(root.className).toBe('custom');
  });

  it('invokes onHide callback', () => {
    const onHide = vi.fn();
    render(<ButtonBubbleMenuDefault onHide={onHide} />);

    expect(capturedOnHide).toBeDefined();
    capturedOnHide!();
    expect(onHide).toHaveBeenCalledOnce();
  });

  it('shouldShow returns true when button node is active', () => {
    render(<ButtonBubbleMenuDefault />);

    expect(capturedShouldShow).toBeDefined();

    mockEditor.isActive.mockReturnValue(true);
    expect(
      capturedShouldShow!({ editor: mockEditor, view: mockEditor.view }),
    ).toBe(true);

    mockEditor.isActive.mockReturnValue(false);
    expect(
      capturedShouldShow!({ editor: mockEditor, view: mockEditor.view }),
    ).toBe(false);
  });
});
