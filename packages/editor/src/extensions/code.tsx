import { EmailMark } from '../core/serializer/email-mark';
import { inlineCssToJs } from '../utils/styles';
import { getStarterKitMark } from './starter-kit-extension';

export const Code = EmailMark.from(
  getStarterKitMark('code'),
  ({ children, node, style }) => (
    <code style={{ ...style, ...inlineCssToJs(node.attrs?.style) }}>
      {children}
    </code>
  ),
);
