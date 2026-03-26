import type { StrikeOptions } from '@tiptap/extension-strike';
import StrikeBase from '@tiptap/extension-strike';

export { type StrikeOptions };

export const Strike = StrikeBase.extend({
  renderToReactEmail({ children, style }) {
    return <s style={style}>{children}</s>;
  },
});
