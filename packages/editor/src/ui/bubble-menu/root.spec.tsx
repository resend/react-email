import { cleanup, render, screen } from '@testing-library/react';
import { BubbleMenuRoot } from './root';

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
    state: {
      selection: {
        content: () => ({ size: 1 }),
        $from: { depth: 0, node: () => ({ type: { name: 'doc' } }) },
      },
    },
    dom: { classList: { contains: vi.fn().mockReturnValue(false) } },
  },
  state: { selection: { from: 0, to: 5 } },
  commands: { focus: vi.fn() },
  on: vi.fn(),
  off: vi.fn(),
};

let currentEditor: typeof mockEditor | null = null;

vi.mock('@tiptap/react', () => ({
  useCurrentEditor: () => ({ editor: currentEditor }),
  useEditorState: ({
    selector,
  }: {
    selector: (ctx: { editor: unknown }) => unknown;
  }) => selector({ editor: mockEditor }),
}));

vi.mock('@tiptap/react/menus', () => ({
  BubbleMenu: ({
    children,
    className,
    options,
  }: {
    children: React.ReactNode;
    className?: string;
    options?: { placement?: string; offset?: number; onHide?: () => void };
  }) => (
    <div
      data-testid="bubble-menu-root"
      data-re-bubble-menu=""
      data-placement={options?.placement}
      data-offset={options?.offset}
      className={className}
    >
      {children}
    </div>
  ),
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

describe('BubbleMenuRoot', () => {
  it('renders null when no editor context is available', () => {
    const { container } = render(
      <BubbleMenuRoot>
        <div>child</div>
      </BubbleMenuRoot>,
    );
    expect(container.innerHTML).toBe('');
  });

  describe('when no children are provided (default bubble menu)', () => {
    beforeEach(() => {
      currentEditor = mockEditor;
    });

    afterEach(() => {
      currentEditor = null;
    });

    it('renders the default bubble menu with all sections', () => {
      render(<BubbleMenuRoot />);

      expect(screen.getByTestId('bubble-menu-root')).toBeDefined();

      expect(screen.getByText('Text')).toBeDefined();
      expect(screen.getByLabelText('Add link')).toBeDefined();

      expect(screen.getByLabelText('bold')).toBeDefined();
      expect(screen.getByLabelText('italic')).toBeDefined();
      expect(screen.getByLabelText('underline')).toBeDefined();
      expect(screen.getByLabelText('strike')).toBeDefined();
      expect(screen.getByLabelText('code')).toBeDefined();
      expect(screen.getByLabelText('uppercase')).toBeDefined();

      expect(screen.getByLabelText('align-left')).toBeDefined();
      expect(screen.getByLabelText('align-center')).toBeDefined();
      expect(screen.getByLabelText('align-right')).toBeDefined();
    });

    it('renders two item groups', () => {
      render(<BubbleMenuRoot />);

      expect(screen.getAllByRole('group')).toHaveLength(2);
    });

    it('renders custom children instead of the default menu', () => {
      render(
        <BubbleMenuRoot>
          <span>custom child</span>
        </BubbleMenuRoot>,
      );

      expect(screen.getByText('custom child')).toBeDefined();
      expect(screen.queryByLabelText('bold')).toBeNull();
      expect(screen.queryByLabelText('Add link')).toBeNull();
    });

    it('forwards placement and offset to the default menu', () => {
      render(<BubbleMenuRoot placement="top" offset={16} />);

      const root = screen.getByTestId('bubble-menu-root');
      expect(root.dataset.placement).toBe('top');
      expect(root.dataset.offset).toBe('16');
    });

    it('forwards className to the default menu', () => {
      render(<BubbleMenuRoot className="custom-class" />);

      const root = screen.getByTestId('bubble-menu-root');
      expect(root.className).toBe('custom-class');
    });
  });
});
