import { Text as BaseText } from '@tiptap/extension-text';
import { EmailNode } from '../core';

export const Text = EmailNode.from(BaseText, ({ children }) => {
  return <>{children}</>;
});
