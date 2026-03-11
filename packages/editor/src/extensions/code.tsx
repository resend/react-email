import Code from '@tiptap/extension-code';
import { EmailMark } from '../core/serializer/email-mark';
import { inlineCssToJs } from '../utils/styles';

export const Code = EmailMark.from(Code, ({ children, node, style }) => (
  <code style={{ ...style, ...inlineCssToJs(node.attrs?.style) }}>
    {children}
  </code>
));
