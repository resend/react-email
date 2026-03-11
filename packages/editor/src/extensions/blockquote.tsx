import { EmailNode } from '../core/serializer/email-node';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';
import { getStarterKitNode } from './starter-kit-extension';

export const Blockquote = EmailNode.from(
  getStarterKitNode('blockquote'),
  ({ children, node, style }) => (
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
  ),
);
