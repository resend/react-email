import type { Element, ElementContent, Root, RootContent } from 'hast';
import { fromHtml } from 'hast-util-from-html';

type TreeNode = ElementContent | RootContent;
type ParentNode = Root | Element;

export async function toPlainTextUnstable(html: string): Promise<string> {
  const tree = fromHtml(html);

  // hast nodes only carry `children` arrays: no parent or sibling links. So a
  // pointer-chasing walk has to record, on the way down, how it reached each
  // node — `firstChild` writes that link, `nextSibling` reads it back to move
  // forward, climbing out of ancestors whose children are exhausted.
  const positions = new WeakMap<
    object,
    { parent: ParentNode; index: number }
  >();

  function firstChild(node: ParentNode | TreeNode): TreeNode | undefined {
    if (!('children' in node)) return undefined;
    const child = node.children[0];
    if (child === undefined) return undefined;
    positions.set(child, { parent: node as ParentNode, index: 0 });
    return child;
  }

  function nextSibling(node: TreeNode): TreeNode | undefined {
    for (
      let position = positions.get(node);
      position !== undefined;
      position = positions.get(position.parent)
    ) {
      const sibling = position.parent.children[position.index + 1];
      if (sibling !== undefined) {
        positions.set(sibling, {
          parent: position.parent,
          index: position.index + 1,
        });
        return sibling;
      }
    }
    return undefined;
  }

  let body: Element | undefined;
  for (
    let node = firstChild(tree);
    node !== undefined;
    node = firstChild(node) ?? nextSibling(node)
  ) {
    if (node.type === 'element' && node.tagName === 'body') {
      body = node;
      break;
    }
  }

  const text: string[] = [];
  let node = firstChild(body ?? tree);
  while (node !== undefined) {
    if (node.type === 'text') text.push(node.value);
    node = firstChild(node) ?? nextSibling(node);
  }
  return text.join('');
}
