import Placeholder from '@tiptap/extension-placeholder';
import type { Node } from '@tiptap/pm/model';

export interface PlaceholderOptions {
  placeholder?: string | ((props: { node: Node }) => string);
  includeChildren?: boolean;
}

export const createPlaceholderExtension = (
  options?: Partial<PlaceholderOptions>,
) => {
  return Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return `Heading ${node.attrs.level}`;
      }
      return "Press '/' for commands";
    },
    includeChildren: true,
    ...options,
  });
};

export const placeholder = createPlaceholderExtension();
