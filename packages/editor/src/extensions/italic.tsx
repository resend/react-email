import ItalicExtension from '@tiptap/extension-italic';
import { EmailMark } from '../core/serializer/email-mark';

export const Italic = EmailMark.from(ItalicExtension, ({ children, style }) => (
  <em style={style}>{children}</em>
));
