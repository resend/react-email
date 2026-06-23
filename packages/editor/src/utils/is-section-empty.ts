import type { Node as ProseMirrorNode } from '@tiptap/pm/model';

const isSectionEmpty = (node: ProseMirrorNode): boolean => {
  if (node.textContent !== '') return false;

  const children = Array.from(
    { length: node.childCount },
    (_, i) => node.child(i),
  );
  if (children.some((child) => child.isLeaf)) return false;

  return node.content.size <= node.childCount * 2;
};

export { isSectionEmpty };
