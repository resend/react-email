import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { BubbleMenuDefault } from './default.js';

const mockEditor = {
  isActive: vi.fn().mockReturnValue(false),
  getAttributes: vi.fn().mockReturnValue({}),
  chain: vi.fn().mockReturnValue({
    focus: vi.fn().mockReturnThis(),
    clearNodes: vi.fn().mockReturnThis(),
    toggleNode: vi.fn().mockReturnThis(),
    toggleHeading: vi.fn().mockReturnThis(),
    toggleBulletList: vi.fn().mockReturnThis(),
    toggleOrderedList: vi.fn().mockReturnThis(),
    toggleBlockquote: vi.fn().mockReturnThis(),
    toggleCodeBlock: vi.fn().mockReturnThis(),
    toggleBold: vi.fn().mockReturnThis(),
    toggleItalic: vi.fn().mockReturnThis(),
    toggleUnderline: vi.fn().mockReturnThis(),
    toggleStrike: vi.fn().mockReturnThis(),
    toggleCode: vi.fn().mockReturnThis(),
    toggleUppercase: vi.fn().mockReturnThis(),
    unsetLink: vi.fn().mockReturnThis(),
    setLink: vi.fn().mockReturnThis(),
    extendMarkRange: vi.fn().mockReturnThis(),
    setTextSelection: vi.fn().mockReturnThis(),
    run: vi.fn(),
  }),
  view: {
    state: { selection: { content: () => ({ size: 1 }) } },
    dom: { classList: { contains: vi.fn().mockReturnValue(false) } },
  },
  state: { selection: { from: 0, to: 5 } },
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
        data-re-bubble-menu=""
        data-placement={options?.placement}
        data-offset={options?.offset}
        className={className}
      >
        {children}
      </div>
    );
  },
}));

vi.mock('@radix-ui/react-popover', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Trigger: ({
    children,
    ...props
  }: { children: React.ReactNode } & Record<string, unknown>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  Content: ({
    children,
    ...props
  }: { children: React.ReactNode } & Record<string, unknown>) => (
    <div {...props}>{children}</div>
  ),
}));

vi.mock('../../core/event-bus', () => ({
  editorEventBus: {
    on: () => ({ unsubscribe: vi.fn() }),
  },
}));

vi.mock('../../utils/set-text-alignment', () => ({
  setTextAlignment: vi.fn(),
}));

afterEach(() => {
  cleanup();
});

describe('BubbleMenuDefault', () => {
  it('renders all sections by default', () => {
    render(<BubbleMenuDefault />);

    // Node selector
    expect(screen.getByText('Text')).toBeDefined();

    // Link selector
    expect(screen.getByLabelText('Add link')).toBeDefined();

    // Formatting items
    expect(screen.getByLabelText('bold')).toBeDefined();
    expect(screen.getByLabelText('italic')).toBeDefined();
    expect(screen.getByLabelText('underline')).toBeDefined();
    expect(screen.getByLabelText('strike')).toBeDefined();
    expect(screen.getByLabelText('code')).toBeDefined();
    expect(screen.getByLabelText('uppercase')).toBeDefined();

    // Alignment items
    expect(screen.getByLabelText('align-left')).toBeDefined();
    expect(screen.getByLabelText('align-center')).toBeDefined();
    expect(screen.getByLabelText('align-right')).toBeDefined();

    // Two item groups
    expect(screen.getAllByRole('group')).toHaveLength(2);
  });

  it('hides specific items via excludeItems', () => {
    render(<BubbleMenuDefault excludeItems={['bold', 'italic']} />);

    expect(screen.queryByLabelText('bold')).toBeNull();
    expect(screen.queryByLabelText('italic')).toBeNull();

    // Others still present
    expect(screen.getByLabelText('underline')).toBeDefined();
    expect(screen.getByLabelText('strike')).toBeDefined();
    expect(screen.getByLabelText('code')).toBeDefined();
    expect(screen.getByLabelText('uppercase')).toBeDefined();
  });

  it('hides node-selector when excluded', () => {
    render(<BubbleMenuDefault excludeItems={['node-selector']} />);

    expect(screen.queryByText('Text')).toBeNull();
    // Link selector still present
    expect(screen.getByLabelText('Add link')).toBeDefined();
  });

  it('hides link-selector when excluded', () => {
    render(<BubbleMenuDefault excludeItems={['link-selector']} />);

    expect(screen.queryByLabelText('Add link')).toBeNull();
  });

  it('omits entire formatting group when all 6 marks are excluded', () => {
    render(
      <BubbleMenuDefault
        excludeItems={[
          'bold',
          'italic',
          'underline',
          'strike',
          'code',
          'uppercase',
        ]}
      />,
    );

    // Only alignment group remains
    expect(screen.getAllByRole('group')).toHaveLength(1);
  });

  it('omits entire alignment group when all 3 alignment items are excluded', () => {
    render(
      <BubbleMenuDefault
        excludeItems={['align-left', 'align-center', 'align-right']}
      />,
    );

    // Only formatting group remains
    expect(screen.getAllByRole('group')).toHaveLength(1);
  });

  it('forwards excludeNodes to Root so shouldShow rejects excluded nodes', () => {
    render(<BubbleMenuDefault excludeNodes={['image', 'button']} />);

    expect(capturedShouldShow).toBeDefined();

    // When an excluded node is active, shouldShow returns false
    mockEditor.isActive.mockReturnValueOnce(true);
    expect(
      capturedShouldShow!({ editor: mockEditor, view: mockEditor.view }),
    ).toBe(false);

    // When no excluded node is active, shouldShow returns true
    mockEditor.isActive.mockReturnValue(false);
    expect(
      capturedShouldShow!({ editor: mockEditor, view: mockEditor.view }),
    ).toBe(true);
  });

  it('forwards placement and offset to Root', () => {
    render(<BubbleMenuDefault placement="top" offset={16} />);

    const root = screen.getByTestId('bubble-menu-root');
    expect(root.dataset.placement).toBe('top');
    expect(root.dataset.offset).toBe('16');
  });

  it('applies className to the root element', () => {
    render(<BubbleMenuDefault className="custom-menu" />);

    const root = screen.getByTestId('bubble-menu-root');
    expect(root.className).toBe('custom-menu');
  });

  it('invokes onHide callback when bubble menu hides', () => {
    const onHide = vi.fn();
    render(<BubbleMenuDefault onHide={onHide} />);

    expect(capturedOnHide).toBeDefined();
    capturedOnHide!();
    expect(onHide).toHaveBeenCalledOnce();
  });

  it('onHide resets both selector open states', () => {
    render(<BubbleMenuDefault />);

    // Open link selector
    fireEvent.click(screen.getByLabelText('Add link'));
    expect(screen.getByPlaceholderText('Paste a link')).toBeDefined();

    // Simulate bubble menu hiding (called outside React event system)
    act(() => {
      capturedOnHide!();
    });

    // Link form should be gone (isLinkSelectorOpen reset to false)
    expect(screen.queryByPlaceholderText('Paste a link')).toBeNull();
  });

  it('opening node-selector closes link-selector', () => {
    render(<BubbleMenuDefault />);

    // Open link selector first
    fireEvent.click(screen.getByLabelText('Add link'));
    expect(screen.getByPlaceholderText('Paste a link')).toBeDefined();

    // Open node selector — should close link selector
    // Trigger shows "Multiple" since mock editor has no active node type
    const nodeTrigger = document.querySelector(
      '[data-re-node-selector-trigger]',
    )!;
    fireEvent.click(nodeTrigger);

    expect(screen.queryByPlaceholderText('Paste a link')).toBeNull();
  });

  it('opening link-selector closes node-selector', () => {
    render(<BubbleMenuDefault />);

    // Open node selector first via the trigger
    const nodeTrigger = document.querySelector(
      '[data-re-node-selector-trigger]',
    )!;
    fireEvent.click(nodeTrigger);

    // Verify node selector is open via data attribute
    const nodeSelector = document.querySelector('[data-re-node-selector]')!;
    expect(nodeSelector.hasAttribute('data-open')).toBe(true);

    // Open link selector — should close node selector
    fireEvent.click(screen.getByLabelText('Add link'));

    expect(nodeSelector.hasAttribute('data-open')).toBe(false);
  });
});
