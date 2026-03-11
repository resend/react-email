import type { Node } from '@tiptap/pm/model';

export function isDocumentVisuallyEmpty(doc: Node): boolean {
  let nonGlobalNodeCount = 0;
  let firstNonGlobalNode: {
    type: { name: string };
    textContent: string;
    childCount: number;
  } | null = null;

  for (let index = 0; index < doc.childCount; index += 1) {
    const node = doc.child(index);

    if (node.type.name === 'globalContent') {
      continue;
    }

    nonGlobalNodeCount += 1;

    if (firstNonGlobalNode === null) {
      firstNonGlobalNode = {
        type: node.type,
        textContent: node.textContent,
        childCount: node.content.childCount,
      };
    }
  }

  if (nonGlobalNodeCount === 0) {
    return true;
  }

  if (nonGlobalNodeCount !== 1) {
    return false;
  }

  return (
    firstNonGlobalNode?.type.name === 'paragraph' &&
    firstNonGlobalNode.textContent.trim().length === 0 &&
    firstNonGlobalNode.childCount === 0
  );
}
