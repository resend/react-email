import { render, screen } from '@testing-library/react';
import { EditorContext } from '@tiptap/react';
import {
  EditorFocusScope,
  EditorFocusScopeProvider,
  useEditorFocusScope,
} from './editor-focus-scope';

describe('EditorFocusScope', () => {
  it('renders children without a provider', () => {
    render(
      <EditorFocusScope>
        <button type="button">Scoped action</button>
      </EditorFocusScope>,
    );

    expect(screen.getByRole('button', { name: 'Scoped action' })).toBeDefined();
  });

  it('registers and unregisters children with extension storage', () => {
    const registerScope = vi.fn();
    const unregisterScope = vi.fn();
    const editor = {
      extensionStorage: {
        focusScope: {
          registerScope,
          unregisterScope,
        },
      },
    };

    const { unmount } = render(
      <EditorContext.Provider value={{ editor: editor as any }}>
        <EditorFocusScope>
          <button type="button">Scoped action</button>
        </EditorFocusScope>
      </EditorContext.Provider>,
    );

    const button = screen.getByRole('button', { name: 'Scoped action' });
    expect(registerScope).toHaveBeenCalledWith(button);

    unmount();
    expect(unregisterScope).toHaveBeenCalledWith(button);
  });
});

describe('EditorFocusScopeProvider', () => {
  it('is a no-op compatibility wrapper', () => {
    render(
      <EditorFocusScopeProvider clearSelectionOnBlur={false}>
        <button type="button">Inside provider</button>
      </EditorFocusScopeProvider>,
    );

    expect(
      screen.getByRole('button', { name: 'Inside provider' }),
    ).toBeDefined();
  });
});

describe('useEditorFocusScope', () => {
  it('returns the extension storage registration functions', () => {
    const registerScope = vi.fn();
    const unregisterScope = vi.fn();
    const editor = {
      extensionStorage: {
        focusScope: {
          registerScope,
          unregisterScope,
        },
      },
    };

    function Probe() {
      const focusScope = useEditorFocusScope();
      focusScope.registerScope(null);
      focusScope.unregisterScope(null);
      return null;
    }

    render(
      <EditorContext.Provider value={{ editor: editor as any }}>
        <Probe />
      </EditorContext.Provider>,
    );

    expect(registerScope).toHaveBeenCalledWith(null);
    expect(unregisterScope).toHaveBeenCalledWith(null);
  });
});
