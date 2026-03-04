import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LinkBubbleMenuContext } from './context';
import { LinkBubbleMenuForm } from './form';

const mockRun = vi.fn();

function createMockEditor(
  { from, to }: { from: number; to: number } = { from: 0, to: 0 },
) {
  const run = mockRun;
  const setTextSelection = vi.fn(() => ({ run }));
  const setLink = vi.fn(() => ({ run, setTextSelection }));
  const extendMarkRange = vi.fn(() => ({ setLink }));
  const unsetLink = vi.fn(() => ({ run }));
  return {
    chain: vi.fn(() => ({ unsetLink, extendMarkRange, setLink })),
    state: { selection: { from, to } },
    commands: { focus: vi.fn() },
  } as any;
}

const mockSetIsEditing = vi.fn();

function renderWithContext(
  ui: ReactNode,
  {
    isEditing = true,
    linkHref = 'https://example.com',
    editor = createMockEditor(),
  }: { isEditing?: boolean; linkHref?: string; editor?: any } = {},
) {
  return render(
    <LinkBubbleMenuContext.Provider
      value={{
        editor,
        linkHref,
        isEditing,
        setIsEditing: mockSetIsEditing,
      }}
    >
      {ui}
    </LinkBubbleMenuContext.Provider>,
  );
}

describe('LinkBubbleMenuForm', () => {
  beforeEach(() => {
    mockSetIsEditing.mockClear();
    mockRun.mockClear();
    vi.useRealTimers();
  });

  describe('rendering', () => {
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

  describe('submit with valid URL', () => {
    it('applies link and calls onLinkApply', () => {
      const editor = createMockEditor();
      const onLinkApply = vi.fn();
      renderWithContext(<LinkBubbleMenuForm onLinkApply={onLinkApply} />, {
        linkHref: '',
        editor,
      });

      const input = screen.getByPlaceholderText(
        'Paste a link',
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'https://new-link.com' } });
      fireEvent.submit(input.closest('form')!);

      expect(editor.chain).toHaveBeenCalled();
      expect(mockSetIsEditing).toHaveBeenCalledWith(false);
      expect(onLinkApply).toHaveBeenCalledWith('https://new-link.com');
    });
  });

  describe('submit with empty value', () => {
    it('removes link and calls onLinkRemove', () => {
      const editor = createMockEditor();
      const onLinkRemove = vi.fn();
      renderWithContext(<LinkBubbleMenuForm onLinkRemove={onLinkRemove} />, {
        linkHref: '',
        editor,
      });

      const input = screen.getByPlaceholderText(
        'Paste a link',
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.submit(input.closest('form')!);

      expect(editor.chain).toHaveBeenCalled();
      expect(mockSetIsEditing).toHaveBeenCalledWith(false);
      expect(onLinkRemove).toHaveBeenCalled();
    });
  });

  describe('submit with invalid URL', () => {
    it('removes link and calls onLinkRemove for invalid input', () => {
      const editor = createMockEditor();
      const onLinkRemove = vi.fn();
      const onLinkApply = vi.fn();
      renderWithContext(
        <LinkBubbleMenuForm
          onLinkRemove={onLinkRemove}
          onLinkApply={onLinkApply}
        />,
        { linkHref: '', editor },
      );

      const input = screen.getByPlaceholderText(
        'Paste a link',
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'not a valid url' } });
      fireEvent.submit(input.closest('form')!);

      expect(onLinkRemove).toHaveBeenCalled();
      expect(onLinkApply).not.toHaveBeenCalled();
    });
  });

  describe('custom validateUrl', () => {
    it('uses custom validator instead of default', () => {
      const editor = createMockEditor();
      const validateUrl = vi.fn(() => 'https://custom-validated.com');
      const onLinkApply = vi.fn();
      renderWithContext(
        <LinkBubbleMenuForm
          validateUrl={validateUrl}
          onLinkApply={onLinkApply}
        />,
        { linkHref: '', editor },
      );

      const input = screen.getByPlaceholderText(
        'Paste a link',
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'anything' } });
      fireEvent.submit(input.closest('form')!);

      expect(validateUrl).toHaveBeenCalledWith('anything');
      expect(onLinkApply).toHaveBeenCalledWith('https://custom-validated.com');
    });

    it('removes link when custom validator returns null', () => {
      const editor = createMockEditor();
      const validateUrl = vi.fn(() => null);
      const onLinkRemove = vi.fn();
      renderWithContext(
        <LinkBubbleMenuForm
          validateUrl={validateUrl}
          onLinkRemove={onLinkRemove}
        />,
        { linkHref: '', editor },
      );

      const input = screen.getByPlaceholderText(
        'Paste a link',
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.submit(input.closest('form')!);

      expect(onLinkRemove).toHaveBeenCalled();
    });
  });

  describe('unlink button', () => {
    it('removes link on click and calls onLinkRemove', () => {
      const editor = createMockEditor();
      const onLinkRemove = vi.fn();
      renderWithContext(<LinkBubbleMenuForm onLinkRemove={onLinkRemove} />, {
        linkHref: 'https://example.com',
        editor,
      });

      fireEvent.click(screen.getByLabelText('Remove link'));

      expect(editor.chain).toHaveBeenCalled();
      expect(mockSetIsEditing).toHaveBeenCalledWith(false);
      expect(onLinkRemove).toHaveBeenCalled();
    });
  });

  describe('escape key', () => {
    it('sets isEditing to false on Escape', () => {
      renderWithContext(<LinkBubbleMenuForm />);

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(mockSetIsEditing).toHaveBeenCalledWith(false);
    });

    it('does not react to other keys', () => {
      renderWithContext(<LinkBubbleMenuForm />);

      fireEvent.keyDown(window, { key: 'Enter' });

      expect(mockSetIsEditing).not.toHaveBeenCalledWith(false);
    });
  });

  describe('input interaction', () => {
    it('updates input value on change', () => {
      renderWithContext(<LinkBubbleMenuForm />, { linkHref: '' });

      const input = screen.getByPlaceholderText(
        'Paste a link',
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'https://typed.com' } });

      expect(input.value).toBe('https://typed.com');
    });
  });
});
