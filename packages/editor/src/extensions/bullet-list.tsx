import { EmailNode } from '../core/serializer/email-node';
import { inlineCssToJs } from '../utils/styles';
import { getStarterKitNode } from './starter-kit-extension';

export const BulletList = EmailNode.from(
  getStarterKitNode('bulletList'),
  ({ children, node, style }) => (
    <ul
      className={node.attrs?.class || undefined}
      style={{
        ...style,
        ...inlineCssToJs(node.attrs?.style),
      }}
    >
      {children}
    </ul>
  ),
);
