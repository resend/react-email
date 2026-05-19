import { cleanup, render, screen } from '@testing-library/react';
import { Editor } from '@tiptap/core';
import { EditorContext, EditorProvider } from '@tiptap/react';
import { StarterKit } from '../../extensions';
import { BubbleMenuRoot } from './root';

vi.mock('@tiptap/react/menus', () => ({
  BubbleMenu: ({
    children,
    className,
    options,
    ref,
  }: {
    children: React.ReactNode;
    className?: string;
    options?: { placement?: string; offset?: number; onHide?: () => void };
    ref?: React.Ref<HTMLDivElement>;
  }) => (
    <div
      ref={ref}
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

function waitForCreate() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function createEditor() {
  const element = document.createElement('div');
  document.body.append(element);

  const editor = new Editor({
    element,
    extensions: [StarterKit.configure()],
    content: '<p>Hello world</p>',
  });

  return { editor, element };
}

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

    it('keeps the editor focused when focus moves into the bubble menu', async () => {
      const { editor, element } = createEditor();
      await waitForCreate();

      const { unmount } = render(
        <EditorContext.Provider value={{ editor }}>
          <BubbleMenuRoot>
            <span>custom child</span>
          </BubbleMenuRoot>
        </EditorContext.Provider>,
      );

      const root = screen.getByTestId('bubble-menu-root');
      editor.view.dom.dispatchEvent(
        new FocusEvent('focusin', { bubbles: true }),
      );
      editor.view.dom.dispatchEvent(
        new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: root,
        }),
      );
      root.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

      expect(editor.isFocused).toBe(true);

      unmount();
      editor.destroy();
      element.remove();
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
