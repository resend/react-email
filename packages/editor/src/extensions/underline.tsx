import type { UnderlineOptions as TipTapUnderlineOptions } from '@tiptap/extension-underline';
import UnderlineBase from '@tiptap/extension-underline';

export type UnderlineOptions = TipTapUnderlineOptions;

export const Underline = UnderlineBase.extend({
  renderToReactEmail({ children, style }) {
    return <u style={style}>{children}</u>;
  },
});
