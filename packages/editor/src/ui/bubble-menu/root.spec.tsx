import { cleanup, render, screen } from '@testing-library/react';
import { EditorProvider } from '@tiptap/react';
import { StarterKit } from '../../extensions';
import { BubbleMenuRoot } from './root';

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

const extensions = [StarterKit];

function renderWithEditor(ui: React.ReactElement) {
  return render(
    <EditorProvider extensions={extensions} immediatelyRender>
      {ui}
    </EditorProvider>,
  );
}

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

  describe('when rendered inside EditorProvider (default bubble menu)', () => {
    it('renders the default bubble menu with all sections', () => {
      renderWithEditor(<BubbleMenuRoot />);

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
      renderWithEditor(<BubbleMenuRoot />);

      expect(screen.getAllByRole('group')).toHaveLength(2);
    });

    it('renders custom children instead of the default menu', () => {
      renderWithEditor(
        <BubbleMenuRoot>
          <span>custom child</span>
        </BubbleMenuRoot>,
      );

      expect(screen.getByText('custom child')).toBeDefined();
      expect(screen.queryByLabelText('bold')).toBeNull();
      expect(screen.queryByLabelText('Add link')).toBeNull();
    });

    it('forwards placement and offset to the BubbleMenu', () => {
      renderWithEditor(<BubbleMenuRoot placement="top" offset={16} />);

      const root = screen.getByTestId('bubble-menu-root');
      expect(root.dataset.placement).toBe('top');
      expect(root.dataset.offset).toBe('16');
    });

    it('forwards className to the BubbleMenu', () => {
      renderWithEditor(<BubbleMenuRoot className="custom-class" />);

      const root = screen.getByTestId('bubble-menu-root');
      expect(root.className).toBe('custom-class');
    });
  });
});
