import { Text as BaseText } from '@tiptap/extension-text';

export const Text = BaseText.extend({
  renderToReactEmail({ children }) {
    return <>{children}</>;
  },
});
