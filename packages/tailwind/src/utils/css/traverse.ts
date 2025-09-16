import type { Element } from 'stylis';

/**
 * Recursively traverses down the children of an element and yields each element
 */
export function* traverse(node: string | Element): Generator<string | Element> {
  yield node;
  if (typeof node === 'object' && node.children) {
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        yield* traverse(child);
      }
    } else {
      yield node.children;
    }
  }
}
