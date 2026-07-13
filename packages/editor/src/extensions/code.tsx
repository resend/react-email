import CodeBase from '@tiptap/extension-code';
import { EmailMark } from '../core/serializer/email-mark';
import { inlineCssToJs } from '../utils/styles';

export const Code = EmailMark.from(
  CodeBase,
  ({ children, node, style, mark }) => (
    <code
      style={{
        ...style,
        ...inlineCssToJs(node.attrs?.style),
        ...inlineCssToJs(mark?.attrs?.style),
      }}
    >
      {children}
    </code>
  ),
);
