import type { BulletListOptions } from '@tiptap/extension-bullet-list';
import BulletListBase from '@tiptap/extension-bullet-list';
import { inlineCssToJs } from '../utils/styles';

export { type BulletListOptions };

export const BulletList = BulletListBase.extend({
  renderToReactEmail({ children, node, style }) {
    return (
      <ul
        className={node.attrs?.class || undefined}
        style={{
          ...style,
          ...inlineCssToJs(node.attrs?.style),
        }}
      >
        {children}
      </ul>
    );
  },
});
