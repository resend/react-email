import type { Container, Document } from 'patched-postcss';

export const removeIfEmptyRecursively = (node: Container | Document) => {
  if (node.first === undefined) {
    const parent = node.parent;
    if (parent) {
      node.remove();
      removeIfEmptyRecursively(parent);
    }
  }
};
