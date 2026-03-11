import ItalicBase from '@tiptap/extension-italic';
import { EmailMark } from '../core/serializer/email-mark';

export const Italic = EmailMark.from(ItalicBase, ({ children, style }) => (
  <em style={style}>{children}</em>
));
