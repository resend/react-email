import type { BoldOptions as TipTapBoldOptions } from '@tiptap/extension-bold';
import BoldBase from '@tiptap/extension-bold';
import { EmailMark } from '../core/serializer/email-mark';

export type BoldOptions = TipTapBoldOptions;

const BoldWithoutFontWeightInference = BoldBase.extend({
  parseHTML() {
    return [
      {
        tag: 'strong',
      },
      {
        tag: 'b',
        getAttrs: (node) =>
          (node as HTMLElement).style.fontWeight !== 'normal' && null,
      },
      {
        style: 'font-weight=400',
        clearMark: (mark) => mark.type.name === this.name,
      },
    ];
  },
});

export const Bold: EmailMark<TipTapBoldOptions, any> = EmailMark.from(
  BoldWithoutFontWeightInference,
  ({ children, style }) => <strong style={style}>{children}</strong>,
);
