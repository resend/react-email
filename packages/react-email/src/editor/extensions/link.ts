import TiptapLink from '@tiptap/extension-link';
import { editorEventBus } from '../core/event-bus.js';
import { processStylesForUnlink } from './preserved-style.js';

export const Link = TiptapLink.extend({
  parseHTML() {
    return [
      {
        tag: 'a[target]:not([data-id="react-email-button"])',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          // Preserve all attributes
          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
      {
        tag: 'a[href]:not([data-id="react-email-button"])',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          // Preserve all attributes
          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  addAttributes() {
    return {
      ...this.parent?.(),

      'ses:no-track': {
        default: null,
        parseHTML: (element) => element.getAttribute('ses:no-track'),
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),

      unsetLink:
        () =>
        ({ state, chain }) => {
          const { from } = state.selection;
          const linkMark = state.doc
            .resolve(from)
            .marks()
            .find((m) => m.type.name === 'link');
          const linkStyle = linkMark?.attrs?.style ?? null;

          const preservedStyle = processStylesForUnlink(linkStyle);

          const shouldRemoveUnderline = preservedStyle !== linkStyle;

          if (preservedStyle) {
            const cmd = chain()
              .extendMarkRange('link')
              .unsetMark('link')
              .setMark('preservedStyle', { style: preservedStyle });

            return shouldRemoveUnderline
              ? cmd.unsetMark('underline').run()
              : cmd.run();
          }

          return chain()
            .extendMarkRange('link')
            .unsetMark('link')
            .unsetMark('underline')
            .run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        editorEventBus.dispatch('add-link', undefined);
        // unselect
        return this.editor.chain().focus().toggleLink({ href: '' }).run();
      },
    };
  },
});
