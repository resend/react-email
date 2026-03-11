import { EmailMark } from '../core/serializer/email-mark';
import { getStarterKitMark } from './starter-kit-extension';

export const Italic = EmailMark.from(
  getStarterKitMark('italic'),
  ({ children, style }) => <em style={style}>{children}</em>,
);
