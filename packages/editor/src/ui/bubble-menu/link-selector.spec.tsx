import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { BubbleMenuLinkSelector } from './link-selector';

const mockEditor = {
  isActive: vi.fn().mockReturnValue(false),
  getAttributes: vi.fn().mockReturnValue({}),
  chain: vi.fn().mockReturnValue({
    focus: vi.fn().mockReturnThis(),
    unsetLink: vi.fn().mockReturnThis(),
    setLink: vi.fn().mockReturnThis(),
    extendMarkRange: vi.fn().mockReturnThis(),
    setTextSelection: vi.fn().mockReturnThis(),
    run: vi.fn(),
  }),
  state: { selection: { from: 0, to: 5 } },
  commands: { focus: vi.fn() },
};

vi.mock('@tiptap/react', () => ({
  useEditorState: ({
    selector,
  }: {
    selector: (ctx: { editor: unknown }) => unknown;
  }) => selector({ editor: mockEditor }),
}));

vi.mock('./context', () => ({
  useBubbleMenuContext: () => ({ editor: mockEditor }),
}));

vi.mock('../../core/event-bus', () => ({
  editorEventBus: {
    on: () => ({ unsubscribe: vi.fn() }),
  },
}));

afterEach(() => {
  cleanup();
});

describe('BubbleMenuLinkSelector', () => {
  describe('uncontrolled mode (default)', () => {
    it('toggles open state on trigger click', () => {
      render(<BubbleMenuLinkSelector />);

      expect(screen.queryByPlaceholderText('Paste a link')).toBeNull();

      fireEvent.click(screen.getByLabelText('Add link'));
      expect(screen.getByPlaceholderText('Paste a link')).toBeDefined();

      fireEvent.click(screen.getByLabelText('Add link'));
      expect(screen.queryByPlaceholderText('Paste a link')).toBeNull();
    });
  });

  describe('controlled mode', () => {
    it('renders open when open=true', () => {
      render(<BubbleMenuLinkSelector open={true} onOpenChange={() => {}} />);

      expect(screen.getByPlaceholderText('Paste a link')).toBeDefined();
    });

    it('renders closed when open=false', () => {
      render(<BubbleMenuLinkSelector open={false} onOpenChange={() => {}} />);

      expect(screen.queryByPlaceholderText('Paste a link')).toBeNull();
    });

    it('calls onOpenChange when trigger is clicked', () => {
      const onOpenChange = vi.fn();
      render(
        <BubbleMenuLinkSelector open={false} onOpenChange={onOpenChange} />,
      );

      fireEvent.click(screen.getByLabelText('Add link'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('calls onOpenChange with false when toggling off', () => {
      const onOpenChange = vi.fn();
      render(
        <BubbleMenuLinkSelector open={true} onOpenChange={onOpenChange} />,
      );

      fireEvent.click(screen.getByLabelText('Add link'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not update internal state in controlled mode', () => {
      const { rerender } = render(
        <BubbleMenuLinkSelector open={false} onOpenChange={() => {}} />,
      );

      // Click trigger — in controlled mode, open stays false unless parent updates
      fireEvent.click(screen.getByLabelText('Add link'));
      expect(screen.queryByPlaceholderText('Paste a link')).toBeNull();

      // Parent updates to open
      rerender(<BubbleMenuLinkSelector open={true} onOpenChange={() => {}} />);
      expect(screen.getByPlaceholderText('Paste a link')).toBeDefined();
    });
  });
});
