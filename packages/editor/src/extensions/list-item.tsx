import { EmailNode } from '../core/serializer/email-node';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';
import { getStarterKitNode } from './starter-kit-extension';

export const ListItem = EmailNode.from(
  getStarterKitNode('listItem'),
  ({ children, node, style }) => (
    <li
      className={node.attrs?.class || undefined}
      style={{
        ...style,
        ...inlineCssToJs(node.attrs?.style),
        ...getTextAlignment(node.attrs?.align || node.attrs?.alignment),
      }}
    >
      {children}
    </li>
  ),
);
