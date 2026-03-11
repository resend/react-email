import { render } from '@testing-library/react';
import { ButtonBubbleMenuRoot } from './root.js';

vi.mock('@tiptap/react', () => ({
  useCurrentEditor: () => ({ editor: null }),
  useEditorState: () => null,
}));

vi.mock('@tiptap/react/menus', () => ({
  BubbleMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bubble-menu">{children}</div>
  ),
}));

describe('ButtonBubbleMenuRoot', () => {
  it('returns null when editor is null', () => {
    const { container } = render(
      <ButtonBubbleMenuRoot>
        <span>child</span>
      </ButtonBubbleMenuRoot>,
    );
    expect(container.innerHTML).toBe('');
  });
});
