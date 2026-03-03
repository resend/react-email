import TiptapLink from '@tiptap/extension-link';
import { editorEventBus } from '../event-bus';

export const Link = TiptapLink.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        editorEventBus.dispatch('add-link', undefined);
        return this.editor.chain().focus().toggleLink({ href: '' }).run();
      },
    };
  },
});
