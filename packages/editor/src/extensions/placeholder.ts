import type { Extension } from '@tiptap/core';
import type { PlaceholderOptions as TipTapPlaceholderOptions } from '@tiptap/extension-placeholder';
import TipTapPlaceholder from '@tiptap/extension-placeholder';
import type { Node } from '@tiptap/pm/model';

export interface PlaceholderOptions {
  placeholder?: string | ((props: { node: Node }) => string);
  includeChildren?: boolean;
}

export const Placeholder: Extension<TipTapPlaceholderOptions, any> =
  TipTapPlaceholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return `Heading ${node.attrs.level}`;
      }
      return "Press '/' for commands";
    },
    includeChildren: true,
  });
