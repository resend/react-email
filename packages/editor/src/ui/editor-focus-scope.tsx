import { Slot } from '@radix-ui/react-slot';
import { extensions as nativeTiptapExtensions } from '@tiptap/core';
import { useCurrentEditor } from '@tiptap/react';
import * as React from 'react';
import {
  createFocusScopePlugin,
  createFocusScopesStorage,
  type FocusScopesStorage,
  focusScopePluginKey,
} from '../extensions/focus-scopes';

type FocusScopeContextValue = FocusScopesStorage;

export const FocusScopeContext =
  React.createContext<FocusScopeContextValue | null>(null);

const noopFocusScope: FocusScopeContextValue = {
  registerScope: () => {},
  unregisterScope: () => {},
};

export function useEditorFocusScope() {
  const context = React.useContext(FocusScopeContext);
  const { editor } = useCurrentEditor();
  return context ?? editor?.extensionStorage?.focusScope ?? noopFocusScope;
}

export interface EditorFocusScopeProviderProps {
  children: React.ReactNode;
  clearSelectionOnBlur?: boolean;
}

/**
 * @deprecated Focus scope tracking now lives in the FocusScopes extension,
 * included by default through StarterKit. This component is kept as a
 * compatibility wrapper for editors that do not use StarterKit.
 */
export function EditorFocusScopeProvider({
  children,
  clearSelectionOnBlur = true,
}: EditorFocusScopeProviderProps) {
  const { editor } = useCurrentEditor();
  const [fallbackFocusScope, setFallbackFocusScope] =
    React.useState<FocusScopeContextValue | null>(null);

  React.useLayoutEffect(() => {
    if (!editor) return;

    const hasFocusScopePlugin = editor.state.plugins.some(
      (plugin) => plugin.spec.key === focusScopePluginKey,
    );
    if (hasFocusScopePlugin) {
      setFallbackFocusScope(editor.extensionStorage.focusScope ?? null);
      return;
    }

    const defaultFocusPlugin = editor.state.plugins.find(
      (plugin) =>
        plugin.spec.key === nativeTiptapExtensions.focusEventsPluginKey,
    );
    if (defaultFocusPlugin) {
      editor.unregisterPlugin(nativeTiptapExtensions.focusEventsPluginKey);
    }

    const storage =
      editor.extensionStorage.focusScope ?? createFocusScopesStorage();
    editor.extensionStorage.focusScope = storage;
    editor.registerPlugin(
      createFocusScopePlugin({
        editor,
        storage,
        clearSelectionOnBlur,
      }),
    );
    setFallbackFocusScope(storage);

    return () => {
      editor.unregisterPlugin(focusScopePluginKey);
      if (!editor.isDestroyed && defaultFocusPlugin) {
        editor.registerPlugin(defaultFocusPlugin);
      }
    };
  }, [editor, clearSelectionOnBlur]);

  const focusScope =
    fallbackFocusScope ??
    editor?.extensionStorage?.focusScope ??
    noopFocusScope;

  return (
    <FocusScopeContext.Provider value={focusScope}>
      {children}
    </FocusScopeContext.Provider>
  );
}

export interface EditorFocusScopeProps {
  children: React.ReactNode;
}

export function EditorFocusScope({ children }: EditorFocusScopeProps) {
  const context = React.useContext(FocusScopeContext);
  const { editor } = useCurrentEditor();
  const focusScope = context ?? editor?.extensionStorage?.focusScope;

  if (!focusScope) {
    return <>{children}</>;
  }

  return (
    <Slot
      ref={(element) => {
        if (!element) return;

        focusScope.registerScope(element);
        return () => {
          focusScope.unregisterScope(element);
        };
      }}
    >
      {children}
    </Slot>
  );
}
