import type { Node } from '@tiptap/pm/model';

export function isDocumentVisuallyEmpty(doc: Node): boolean {
  let nonGlobalNodeCount = 0;
  let firstNonGlobalNode: Node | null = null;

  for (let index = 0; index < doc.childCount; index += 1) {
    const node = doc.child(index);

    if (node.type.name === 'globalContent') {
      continue;
    }

    nonGlobalNodeCount += 1;

    if (firstNonGlobalNode === null) {
      firstNonGlobalNode = node;
    }
  }

  if (nonGlobalNodeCount === 0) {
    return true;
  }

  if (nonGlobalNodeCount !== 1) {
    return false;
  }

  if (firstNonGlobalNode!.type.name === 'container') {
    return hasOnlyEmptyParagraph(firstNonGlobalNode!);
  }

  return isEmptyParagraph(firstNonGlobalNode!);
}

function hasOnlyEmptyParagraph(node: Node): boolean {
  if (node.childCount === 0) {
    return true;
  }

  if (node.childCount !== 1) {
    return false;
  }

  return isEmptyParagraph(node.child(0));
}

function isEmptyParagraph(node: Node): boolean {
  return node.type.name === 'paragraph' && node.textContent.length === 0;
}
