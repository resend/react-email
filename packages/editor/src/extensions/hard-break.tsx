import HardBreakBase from '@tiptap/extension-hard-break';
import { EmailNode } from '../core/serializer/email-node';

export const HardBreak = EmailNode.from(HardBreakBase, () => <br />);
