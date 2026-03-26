import type { ItalicOptions } from '@tiptap/extension-italic';
import ItalicBase from '@tiptap/extension-italic';

export { type ItalicOptions };

export const Italic = ItalicBase.extend({
  renderToReactEmail({ children, style }) {
    return <em style={style}>{children}</em>;
  },
});
