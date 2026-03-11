import StrikeExtension from '@tiptap/extension-strike';
import { EmailMark } from '../core/serializer/email-mark';

export const Strike = EmailMark.from(StrikeExtension, ({ children, style }) => (
  <s style={style}>{children}</s>
));
