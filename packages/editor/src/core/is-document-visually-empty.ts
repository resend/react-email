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
    return hasOnlyEmptyTextBlock(firstNonGlobalNode!);
  }

  return isEmptyTextBlock(firstNonGlobalNode!);
}

function hasOnlyEmptyTextBlock(node: Node): boolean {
  if (node.childCount === 0) {
    return true;
  }

  if (node.childCount !== 1) {
    return false;
  }

  return isEmptyTextBlock(node.child(0));
}

const EMPTY_TEXT_BLOCK_TYPES = new Set(['paragraph', 'heading']);

function isEmptyTextBlock(node: Node): boolean {
  return EMPTY_TEXT_BLOCK_TYPES.has(node.type.name) && node.content.size === 0;
}
