import { Slot } from '@radix-ui/react-slot';
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import {
  extensions as nativeTiptapExtensions,
  useCurrentEditor,
} from '@tiptap/react';
import * as React from 'react';

interface FocusScopeContextValue {
  registerScope: (el: HTMLElement | null) => void;
  unregisterScope: (el: HTMLElement | null) => void;
}

export const FocusScopeContext =
  React.createContext<FocusScopeContextValue | null>(null);

export function useEditorFocusScope() {
  const context = React.useContext(FocusScopeContext);
  if (!context) {
    throw new Error(
      'InspectorFocusScope must be used inside an InspectorFocusScopeProvider',
    );
  }
  return context;
}

export interface EditorFocusScopeProviderProps {
  children: React.ReactNode;
  clearSelectionOnBlur?: boolean;
}

export function EditorFocusScopeProvider({
  children,
  clearSelectionOnBlur = true,
}: EditorFocusScopeProviderProps) {
  const { editor } = useCurrentEditor();

  const scopeRefs = React.useRef(new Set<HTMLElement>());

  const handleFocusIn = React.useCallback(
    (event: FocusEvent) => {
      if (!editor) return;
      const t = event.target;
      if (!(t instanceof Node) || !editor.view.dom.contains(t)) {
        return;
      }

      editor.isFocused = true;

      const transaction = editor.state.tr
        .setMeta('focus', { event })
        .setMeta('addToHistory', false);

      editor.view.dispatch(transaction);
    },
    [editor],
  );

  const handleFocusOut = React.useCallback(
    (event: FocusEvent) => {
      const nextFocus = event.relatedTarget as Node | null;
      const stillInside = [...scopeRefs.current].some(
        (el) => nextFocus && el.contains(nextFocus),
      );
      if (!stillInside && editor) {
        editor.isFocused = false;

        const transaction = editor.state.tr
          .setMeta('blur', { event })
          .setMeta('addToHistory', false);

        if (clearSelectionOnBlur) {
          transaction.setSelection(TextSelection.create(transaction.doc, 0));
        }

        editor.view.dispatch(transaction);
      }
    },
    [editor, clearSelectionOnBlur],
  );

  const registerScope = React.useCallback(
    (el: HTMLElement | null) => {
      if (!el) return;
      scopeRefs.current.add(el);
      el.addEventListener('focusin', handleFocusIn);
      el.addEventListener('focusout', handleFocusOut);
    },
    [handleFocusIn, handleFocusOut],
  );

  const unregisterScope = React.useCallback(
    (el: HTMLElement | null) => {
      if (!el) return;
      scopeRefs.current.delete(el);
      el.removeEventListener('focusin', handleFocusIn);
      el.removeEventListener('focusout', handleFocusOut);
    },
    [handleFocusIn, handleFocusOut],
  );

  React.useEffect(() => {
    const defaultFocusPlugin = editor?.state.plugins.find(
      (plugin) =>
        plugin.spec.key === nativeTiptapExtensions.focusEventsPluginKey,
    );
    if (editor && defaultFocusPlugin) {
      editor.unregisterPlugin(nativeTiptapExtensions.focusEventsPluginKey);
      const pluginKey = new PluginKey('inspectorReactEmailFocusEvents');
      editor.registerPlugin(
        new Plugin({
          key: pluginKey,
          view(view) {
            registerScope(view.dom);

            return {
              destroy() {
                unregisterScope(view.dom);
              },
            };
          },
        }),
      );

      return () => {
        editor?.unregisterPlugin(pluginKey);
        editor?.registerPlugin(defaultFocusPlugin);
      };
    }
  }, [editor]);

  return (
    <FocusScopeContext.Provider
      value={{
        registerScope,
        unregisterScope,
      }}
    >
      {children}
    </FocusScopeContext.Provider>
  );
}

export interface EditorFocusScopeProps {
  children: React.ReactNode;
}

export function EditorFocusScope({ children }: EditorFocusScopeProps) {
  const { registerScope, unregisterScope } = useEditorFocusScope();

  return (
    <Slot
      ref={(element) => {
        if (element) {
          registerScope(element);
          return () => {
            unregisterScope(element);
          };
        }
      }}
    >
      {children}
    </Slot>
  );
}
