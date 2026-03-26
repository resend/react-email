import type { BlockquoteOptions } from '@tiptap/extension-blockquote';
import BlockquoteBase from '@tiptap/extension-blockquote';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';

export { type BlockquoteOptions };

export const Blockquote = BlockquoteBase.extend({
  renderToReactEmail({ children, node, style }) {
    return (
      <blockquote
        className={node.attrs?.class || undefined}
        style={{
          ...style,
          ...inlineCssToJs(node.attrs?.style),
          ...getTextAlignment(node.attrs?.align || node.attrs?.alignment),
        }}
      >
        {children}
      </blockquote>
    );
  },
});
