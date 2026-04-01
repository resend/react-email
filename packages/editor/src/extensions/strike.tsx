import type { StrikeOptions } from '@tiptap/extension-strike';
import StrikeBase from '@tiptap/extension-strike';
import { EmailMark } from '../core/serializer/email-mark';

export const Strike: EmailMark<StrikeOptions, any> = EmailMark.from(
  StrikeBase,
  ({ children, style }) => <s style={style}>{children}</s>,
);
