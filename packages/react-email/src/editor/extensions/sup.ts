import { Mark, mergeAttributes } from '@tiptap/core';

export interface SupOptions {
  /**
   * HTML attributes to add to the sup element.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
}

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

/**
 * This extension allows you to mark text as superscript.
 * @see https://tiptap.dev/api/marks/superscript
 */
export const Sup = Mark.create<SupOptions>({
  name: 'sup',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'sup',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'sup',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
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
