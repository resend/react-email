import type { HardBreakOptions } from '@tiptap/extension-hard-break';
import HardBreakBase from '@tiptap/extension-hard-break';
import { EmailNode } from '../core/serializer/email-node';

export const HardBreak: EmailNode<HardBreakOptions, any> = EmailNode.from(
  HardBreakBase,
  () => <br />,
);
