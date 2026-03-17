import CodeBase from '@tiptap/extension-code';
import { EmailMark } from '../core/serializer/email-mark';
import { inlineCssToJs } from '../utils/styles';

export const Code = EmailMark.from(CodeBase, ({ children, node, style }) => (
  <code style={{ ...style, ...inlineCssToJs(node.attrs?.style) }}>
    {children}
  </code>
));
