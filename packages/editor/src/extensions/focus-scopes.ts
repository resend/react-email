import {
  type Editor,
  Extension,
  extensions as nativeTiptapExtensions,
} from '@tiptap/core';
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';

export interface FocusScopesOptions {
  clearSelectionOnBlur: boolean;
}

export interface FocusScopesStorage {
  registerScope: (el: HTMLElement | null) => void;
  unregisterScope: (el: HTMLElement | null) => void;
}

declare module '@tiptap/core' {
  interface Storage {
    focusScope: FocusScopesStorage;
  }
}

export const focusScopePluginKey = new PluginKey('reactEmailFocusScopes');

const noop = () => { };

export function createFocusScopesStorage(): FocusScopesStorage {
  return {
    registerScope: noop,
    unregisterScope: noop,
  };
}

export function createFocusScopePlugin({
  editor,
  storage,
  clearSelectionOnBlur,
}: {
  editor: Editor;
  storage: FocusScopesStorage;
  clearSelectionOnBlur: boolean;
}) {
  const scopeRefs = new Set<HTMLElement>();

  const isInsideScope = (node: Node | null) =>
    Boolean(node && [...scopeRefs].some((el) => el.contains(node)));

  const getClosestScope = (node: Node | null) => {
    if (!node) return null;

    let closest: HTMLElement | null = null;
    for (const scope of scopeRefs) {
      if (!scope.contains(node)) continue;
      if (!closest || closest.contains(scope)) {
        closest = scope;
      }
    }
    return closest;
  };

  const handleFocusIn = (event: FocusEvent) => {
    const target = event.target;
    if (!(target instanceof Node) || !editor.view.dom.contains(target)) {
      return;
    }

    const previous = editor.isFocused;
    editor.isFocused = true;

    if (previous !== editor.isFocused) {
      const transaction = editor.state.tr
        .setMeta('focus', { event })
        .setMeta('addToHistory', false);

      editor.view.dispatch(transaction);
    }
  };

  const handleFocusOut = (event: FocusEvent) => {
    const blur = () => {
      const previous = editor.isFocused;
      editor.isFocused = false;

      if (previous !== editor.isFocused) {
        const transaction = editor.state.tr
          .setMeta('blur', { event })
          .setMeta('addToHistory', false);

        if (clearSelectionOnBlur) {
          transaction.setSelection(TextSelection.create(transaction.doc, 0));
        }

        editor.view.dispatch(transaction);
      }
    };

    const nextFocus = event.relatedTarget as Node | null;
    if (!nextFocus) {
      const previousFocus = event.target as Node | null;
      const fallbackScope = getClosestScope(previousFocus);

      // queueMicrotask is needed so that we can determine reliably
      // whether or not previousFocus is inside of the DOM
      queueMicrotask(() => {
        if (isInsideScope(event.view?.document.activeElement ?? null)) {
          return;
        }

        if (!previousFocus?.isConnected && fallbackScope?.isConnected) {
          fallbackScope.focus({ preventScroll: true });
          return;
        }

        blur();
      });
    }

    if (isInsideScope(nextFocus)) {
      return;
    }
    blur();
    return;
  };

  const registerScope = (el: HTMLElement | null) => {
    if (!el || scopeRefs.has(el)) return;

    scopeRefs.add(el);
    el.addEventListener('focusin', handleFocusIn);
    el.addEventListener('focusout', handleFocusOut);
  };

  const unregisterScope = (el: HTMLElement | null) => {
    if (!el || !scopeRefs.has(el)) return;

    scopeRefs.delete(el);
    el.removeEventListener('focusin', handleFocusIn);
    el.removeEventListener('focusout', handleFocusOut);
  };

  storage.registerScope = registerScope;
  storage.unregisterScope = unregisterScope;

  return new Plugin({
    key: focusScopePluginKey,
    view(view) {
      storage.registerScope = registerScope;
      storage.unregisterScope = unregisterScope;
      registerScope(view.dom);

      return {
        destroy() {
          for (const scope of [...scopeRefs]) {
            unregisterScope(scope);
          }
          storage.registerScope = noop;
          storage.unregisterScope = noop;
        },
      };
    },
  });
}

export const FocusScopes = Extension.create<
  FocusScopesOptions,
  FocusScopesStorage
>({
  name: 'focusScope',

  addOptions() {
    return {
      clearSelectionOnBlur: true,
    };
  },

  addStorage() {
    return createFocusScopesStorage();
  },

  onCreate() {
    this.editor.unregisterPlugin(nativeTiptapExtensions.focusEventsPluginKey);
  },

  addProseMirrorPlugins() {
    return [
      createFocusScopePlugin({
        editor: this.editor,
        storage: this.storage,
        clearSelectionOnBlur: this.options.clearSelectionOnBlur,
      }),
    ];
  },
});
