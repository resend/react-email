import { Slot } from '@radix-ui/react-slot';
import { useCurrentEditor } from '@tiptap/react';
import * as React from 'react';
import type { FocusScopesStorage } from '../extensions/focus-scopes';

type FocusScopeContextValue = FocusScopesStorage;

export const FocusScopeContext =
  React.createContext<FocusScopeContextValue | null>(null);

const noopFocusScope: FocusScopeContextValue = {
  registerScope: () => {},
  unregisterScope: () => {},
};

export function useEditorFocusScope() {
  const { editor } = useCurrentEditor();
  return editor?.extensionStorage?.focusScope ?? noopFocusScope;
}

export interface EditorFocusScopeProviderProps {
  children: React.ReactNode;
  clearSelectionOnBlur?: boolean;
}

/**
 * @deprecated Focus scope tracking now lives in the FocusScopes extension,
 * included by default through StarterKit. This component is kept as a no-op
 * compatibility wrapper.
 */
export function EditorFocusScopeProvider({
  children,
}: EditorFocusScopeProviderProps) {
  return <>{children}</>;
}

export interface EditorFocusScopeProps {
  children: React.ReactNode;
}

export function EditorFocusScope({ children }: EditorFocusScopeProps) {
  const { editor } = useCurrentEditor();
  const focusScope = editor?.extensionStorage?.focusScope;

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
