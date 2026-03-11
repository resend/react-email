import { EmailNode } from '../core/serializer/email-node';
import { inlineCssToJs } from '../utils/styles';
import { getStarterKitNode } from './starter-kit-extension';

export const OrderedList = EmailNode.from(
  getStarterKitNode('orderedList'),
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
