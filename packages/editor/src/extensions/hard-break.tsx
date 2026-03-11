import HardBreakExtension from '@tiptap/extension-hard-break';
import { EmailNode } from '../core/serializer/email-node';

export const HardBreak = EmailNode.from(HardBreakExtension, () => <br />);
