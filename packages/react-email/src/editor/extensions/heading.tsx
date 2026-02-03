import { Heading as TipTapHeading } from '@tiptap/extension-heading';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ReactEmailHeading } from './react-email-heading.js';

export const Heading = TipTapHeading.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ReactEmailHeading);
  },
});
