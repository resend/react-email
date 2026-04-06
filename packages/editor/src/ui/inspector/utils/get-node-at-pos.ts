import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { useCurrentEditor } from '@tiptap/react';

export function getNodeAtExactPos(
  editor: NonNullable<ReturnType<typeof useCurrentEditor>['editor']>,
  nodePos: { pos: number; inside: number },
): { node: ProseMirrorNode; pos: number } | null {
  const doc = editor.state.doc;

  const nodeAtPos = doc.nodeAt(nodePos.pos);
  if (nodeAtPos) {
    return { node: nodeAtPos, pos: nodePos.pos };
  }

  const resolved = doc.resolve(nodePos.pos);
  if (resolved.nodeAfter) {
    return { node: resolved.nodeAfter, pos: nodePos.pos };
  }

  if (resolved.parent && resolved.parent.type.name !== 'doc') {
    const parentPos = resolved.before(resolved.depth);
    return { node: resolved.parent, pos: parentPos };
  }

  return null;
}
