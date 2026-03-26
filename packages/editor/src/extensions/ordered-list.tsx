import type { OrderedListOptions } from '@tiptap/extension-ordered-list';
import OrderedListBase from '@tiptap/extension-ordered-list';
import { inlineCssToJs } from '../utils/styles';

export { type OrderedListOptions };

export const OrderedList = OrderedListBase.extend({
  renderToReactEmail({ children, node, style }) {
    return (
      <ol
        className={node.attrs?.class || undefined}
        start={node.attrs?.start}
        style={{
          ...style,
          ...inlineCssToJs(node.attrs?.style),
        }}
      >
        {children}
      </ol>
    );
  },
});
