import type { Editor, Range } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import type { SlashCommandItem } from './types';

export const SlashCommandExtension = Extension.create({
  name: 'slash-command',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        allow: ({ editor }: { editor: Editor }) =>
          !editor.isActive('codeBlock'),
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: SlashCommandItem;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: new PluginKey('slash-command'),
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
