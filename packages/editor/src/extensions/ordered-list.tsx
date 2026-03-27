import type { OrderedListOptions } from '@tiptap/extension-ordered-list';
import OrderedListBase from '@tiptap/extension-ordered-list';
import { EmailNode } from '../core/serializer/email-node';
import { inlineCssToJs } from '../utils/styles';

export const OrderedList: EmailNode<OrderedListOptions, any> = EmailNode.from(
  OrderedListBase,
  ({ children, node, style }) => (
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
  ),
);
