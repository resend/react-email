import { render, screen } from '@testing-library/react';
import { Editor } from '@tiptap/core';
import { EditorContext } from '@tiptap/react';
import TipTapStarterKit from '@tiptap/starter-kit';
import {
  EditorFocusScope,
  EditorFocusScopeProvider,
  useEditorFocusScope,
} from './editor-focus-scope';

function waitForCreate() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

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
  it('renders children', () => {
    render(
      <EditorFocusScopeProvider clearSelectionOnBlur={false}>
        <button type="button">Inside provider</button>
      </EditorFocusScopeProvider>,
    );

    expect(
      screen.getByRole('button', { name: 'Inside provider' }),
    ).toBeDefined();
  });

  it('installs focus scope tracking when the editor does not use StarterKit', async () => {
    const element = document.createElement('div');
    document.body.append(element);
    const editor = new Editor({
      element,
      extensions: [TipTapStarterKit],
      content: '<p>Hello world</p>',
    });
    await waitForCreate();

    render(
      <EditorContext.Provider value={{ editor }}>
        <EditorFocusScopeProvider>
          <EditorFocusScope>
            <button type="button">Scoped action</button>
          </EditorFocusScope>
        </EditorFocusScopeProvider>
      </EditorContext.Provider>,
    );

    const button = screen.getByRole('button', { name: 'Scoped action' });
    editor.view.dom.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    editor.view.dom.dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: button,
      }),
    );
    button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    expect(editor.isFocused).toBe(true);

    editor.destroy();
    element.remove();
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
