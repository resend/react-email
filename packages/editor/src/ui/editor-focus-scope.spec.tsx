import { render, screen } from '@testing-library/react';
import { Editor } from '@tiptap/core';
import { EditorContext } from '@tiptap/react';
import TipTapStarterKit from '@tiptap/starter-kit';
import * as React from 'react';
import {
  EditorFocusScope,
  EditorFocusScopeProvider,
  useEditorFocusScope,
} from './editor-focus-scope';

function waitForCreate() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const ManuallyForwardedRefChild = React.forwardRef<HTMLDivElement>(
  function ManuallyForwardedRefChild(_, forwardedRef) {
    const elementRef = React.useRef<HTMLDivElement>(null);

    React.useLayoutEffect(() => {
      if (typeof forwardedRef !== 'function') return;

      forwardedRef(elementRef.current);
      return () => {
        forwardedRef(null);
      };
    }, [forwardedRef]);

    return <div ref={elementRef}>Manual ref child</div>;
  },
);

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

  it('unregisters the previous child when the scoped element changes', () => {
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

    const { rerender } = render(
      <EditorContext.Provider value={{ editor: editor as any }}>
        <EditorFocusScope>
          <button type="button">First action</button>
        </EditorFocusScope>
      </EditorContext.Provider>,
    );

    const firstButton = screen.getByRole('button', { name: 'First action' });
    expect(registerScope).toHaveBeenCalledWith(firstButton);

    rerender(
      <EditorContext.Provider value={{ editor: editor as any }}>
        <EditorFocusScope>
          <a href="/second">Second action</a>
        </EditorFocusScope>
      </EditorContext.Provider>,
    );

    const secondLink = screen.getByRole('link', { name: 'Second action' });
    expect(unregisterScope).toHaveBeenCalledWith(firstButton);
    expect(registerScope).toHaveBeenCalledWith(secondLink);
  });

  it('unregisters from the old focus scope when extension storage changes', () => {
    const firstRegisterScope = vi.fn();
    const firstUnregisterScope = vi.fn();
    const secondRegisterScope = vi.fn();
    const secondUnregisterScope = vi.fn();
    const editor = {
      extensionStorage: {
        focusScope: {
          registerScope: firstRegisterScope,
          unregisterScope: firstUnregisterScope,
        },
      },
    };

    const { rerender, unmount } = render(
      <EditorContext.Provider value={{ editor: editor as any }}>
        <EditorFocusScope>
          <button type="button">Scoped action</button>
        </EditorFocusScope>
      </EditorContext.Provider>,
    );

    const button = screen.getByRole('button', { name: 'Scoped action' });
    expect(firstRegisterScope).toHaveBeenCalledWith(button);

    editor.extensionStorage.focusScope = {
      registerScope: secondRegisterScope,
      unregisterScope: secondUnregisterScope,
    };

    rerender(
      <EditorContext.Provider value={{ editor: editor as any }}>
        <EditorFocusScope>
          <button type="button">Scoped action</button>
        </EditorFocusScope>
      </EditorContext.Provider>,
    );

    expect(firstUnregisterScope).toHaveBeenCalledWith(button);
    expect(secondRegisterScope).toHaveBeenCalledWith(button);

    unmount();
    expect(secondUnregisterScope).toHaveBeenCalledWith(button);
  });

  it('unregisters when a forwarded child manually clears the ref', () => {
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
          <ManuallyForwardedRefChild />
        </EditorFocusScope>
      </EditorContext.Provider>,
    );

    const child = screen.getByText('Manual ref child');
    expect(registerScope).toHaveBeenCalledWith(child);

    unmount();
    expect(unregisterScope).toHaveBeenCalledWith(child);
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
