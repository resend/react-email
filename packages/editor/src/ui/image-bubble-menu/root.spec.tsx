import { render } from '@testing-library/react';
import { ImageBubbleMenuRoot } from './root.js';

vi.mock('@tiptap/react', () => ({
  useCurrentEditor: () => ({ editor: null }),
  useEditorState: () => null,
}));

vi.mock('@tiptap/react/menus', () => ({
  BubbleMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bubble-menu">{children}</div>
  ),
}));

describe('ImageBubbleMenuRoot', () => {
  it('returns null when editor is null', () => {
    const { container } = render(
      <ImageBubbleMenuRoot>
        <span>child</span>
      </ImageBubbleMenuRoot>,
    );
    expect(container.innerHTML).toBe('');
  });
});
