import type { SuperscriptExtensionOptions as TipTapSuperscriptOptions } from '@tiptap/extension-superscript';
import SuperscriptBase from '@tiptap/extension-superscript';

export type SupOptions = TipTapSuperscriptOptions;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    sup: {
      /**
       * Set a superscript mark
       */
      setSup: () => ReturnType;
      /**
       * Toggle a superscript mark
       */
      toggleSup: () => ReturnType;
      /**
       * Unset a superscript mark
       */
      unsetSup: () => ReturnType;
    };
  }
}

export const Sup = SuperscriptBase.extend({
  name: 'sup',

  addCommands() {
    return {
      ...this.parent?.(),
      setSup:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      toggleSup:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
      unsetSup:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  renderToReactEmail({ children, style }) {
    return <sup style={style}>{children}</sup>;
  },
});
