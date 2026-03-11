import { EmailNode } from '../core/serializer/email-node';
import { getStarterKitNode } from './starter-kit-extension';

export const HardBreak = EmailNode.from(
  getStarterKitNode('hardBreak'),
  () => <br />,
);
