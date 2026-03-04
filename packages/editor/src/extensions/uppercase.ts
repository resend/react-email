import { Mark, mergeAttributes } from '@tiptap/core';

export interface UppercaseOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    uppercase: {
      setUppercase: () => ReturnType;
      toggleUppercase: () => ReturnType;
      unsetUppercase: () => ReturnType;
    };
  }
}

export const Uppercase = Mark.create<UppercaseOptions>({
  name: 'uppercase',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) => {
          const el = node as HTMLElement;
          if (el.style.textTransform === 'uppercase') {
            return {};
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: 'text-transform: uppercase',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setUppercase:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
      toggleUppercase:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
      unsetUppercase:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
