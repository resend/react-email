import { InputRule } from '@tiptap/core';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ReactEmailDivider } from './react-email-divider.js';

export const Divider = HorizontalRule.extend({
  addAttributes() {
    return {
      class: {
        default: 'divider',
      },
    };
  },
  // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
  addInputRules() {
    return [
      new InputRule({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        handler: ({ state, range }) => {
          const attributes = {};

          const { tr } = state;
          const start = range.from;
          const end = range.to;

          tr.insert(start - 1, this.type.create(attributes)).delete(
            tr.mapping.map(start),
            tr.mapping.map(end),
          );
        },
      }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ReactEmailDivider);
  },
});
