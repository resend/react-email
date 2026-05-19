import type { UnderlineOptions as TipTapUnderlineOptions } from '@tiptap/extension-underline';
import UnderlineBase from '@tiptap/extension-underline';
import { EmailMark } from '../core/serializer/email-mark';

export type UnderlineOptions = TipTapUnderlineOptions;

export const Underline: EmailMark<TipTapUnderlineOptions, any> = EmailMark.from(
  UnderlineBase,
  ({ children, style }) => <u style={style}>{children}</u>,
);
