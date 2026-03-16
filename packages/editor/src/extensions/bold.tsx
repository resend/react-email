import type { BoldOptions as TipTapBoldOptions } from '@tiptap/extension-bold';
import BoldBase from '@tiptap/extension-bold';
import { EmailMark } from '../core/serializer/email-mark';

export type BoldOptions = TipTapBoldOptions;

export const Bold: EmailMark<TipTapBoldOptions, any> = EmailMark.from(
  BoldBase,
  ({ children, style }) => <strong style={style}>{children}</strong>,
);
