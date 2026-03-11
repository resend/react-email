import { EmailMark } from '../core/serializer/email-mark';
import { getStarterKitMark } from './starter-kit-extension';

export const Strike = EmailMark.from(
  getStarterKitMark('strike'),
  ({ children, style }) => <s style={style}>{children}</s>,
);
