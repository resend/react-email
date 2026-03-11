import { cleanup, render, screen } from '@testing-library/react';
import { LinkBubbleMenuDefault } from './default';

const mockEditor = {
  isActive: vi.fn().mockReturnValue(false),
  getAttributes: vi.fn().mockReturnValue({ href: 'https://example.com' }),
  chain: vi.fn().mockReturnValue({
    focus: vi.fn().mockReturnThis(),
    unsetLink: vi.fn().mockReturnThis(),
    setLink: vi.fn().mockReturnThis(),
    extendMarkRange: vi.fn().mockReturnThis(),
    run: vi.fn(),
  }),
  view: {
    state: { selection: { content: () => ({ size: 0 }) } },
    dom: { classList: { contains: vi.fn().mockReturnValue(false) } },
  },
  commands: { focus: vi.fn() },
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

vi.mock('../bubble-menu/utils', () => ({
  focusEditor: vi.fn(),
  getUrlFromString: vi.fn((v: string) => v),
  setLinkHref: vi.fn(),
}));

afterEach(() => {
  cleanup();
  mockEditor.isActive.mockReturnValue(false);
});

describe('LinkBubbleMenuDefault', () => {
  it('renders all toolbar items by default', () => {
    render(<LinkBubbleMenuDefault />);

    expect(screen.getByLabelText('Edit link')).toBeDefined();
    expect(screen.getByLabelText('Open link')).toBeDefined();
    expect(screen.getByLabelText('Remove link')).toBeDefined();
    expect(document.querySelector('[data-re-link-bm-toolbar]')).toBeDefined();
  });

  it('excludeItems: ["edit-link"] hides it, others remain', () => {
    render(<LinkBubbleMenuDefault excludeItems={['edit-link']} />);

    expect(screen.queryByLabelText('Edit link')).toBeNull();
    expect(screen.getByLabelText('Open link')).toBeDefined();
    expect(screen.getByLabelText('Remove link')).toBeDefined();
  });

  it('excludeItems: ["open-link"] hides it, others remain', () => {
    render(<LinkBubbleMenuDefault excludeItems={['open-link']} />);

    expect(screen.getByLabelText('Edit link')).toBeDefined();
    expect(screen.queryByLabelText('Open link')).toBeNull();
    expect(screen.getByLabelText('Remove link')).toBeDefined();
  });

  it('all 3 excluded removes toolbar entirely', () => {
    render(
      <LinkBubbleMenuDefault
        excludeItems={['edit-link', 'open-link', 'unlink']}
      />,
    );

    expect(document.querySelector('[data-re-link-bm-toolbar]')).toBeNull();
  });

  it('renders root even when all toolbar items excluded', () => {
    render(
      <LinkBubbleMenuDefault
        excludeItems={['edit-link', 'open-link', 'unlink']}
      />,
    );

    expect(screen.getByTestId('bubble-menu-root')).toBeDefined();
  });

  it('forwards placement and offset to Root', () => {
    render(<LinkBubbleMenuDefault placement="bottom" offset={16} />);

    const root = screen.getByTestId('bubble-menu-root');
    expect(root.dataset.placement).toBe('bottom');
    expect(root.dataset.offset).toBe('16');
  });

  it('applies className to the root element', () => {
    render(<LinkBubbleMenuDefault className="custom" />);

    const root = screen.getByTestId('bubble-menu-root');
    expect(root.className).toBe('custom');
  });

  it('invokes onHide callback', () => {
    const onHide = vi.fn();
    render(<LinkBubbleMenuDefault onHide={onHide} />);

    expect(capturedOnHide).toBeDefined();
    capturedOnHide!();
    expect(onHide).toHaveBeenCalledOnce();
  });

  it('shouldShow returns true when link is active and selection is empty', () => {
    render(<LinkBubbleMenuDefault />);

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
