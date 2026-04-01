import type { SuperscriptExtensionOptions as TipTapSuperscriptOptions } from '@tiptap/extension-superscript';
import SuperscriptBase from '@tiptap/extension-superscript';
import { EmailMark } from '../core/serializer/email-mark';

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

const SupBase = SuperscriptBase.extend({
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
});

export const Sup: EmailMark<TipTapSuperscriptOptions, any> = EmailMark.from(
  SupBase,
  ({ children, style }) => <sup style={style}>{children}</sup>,
);
