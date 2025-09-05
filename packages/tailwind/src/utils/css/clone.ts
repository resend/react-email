import { type CssNode, List } from 'css-tree';

/**
 * Slightly modified version of csstree's clone, with the difference that it ignores the `parent` property that we add in.
 */
export function clone<T extends CssNode>(node: T): T {
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(node)) {
    let value: any = node[key as keyof CssNode];
    if (key === 'parent') {
      continue;
    }

    if (value) {
      if (value instanceof List) {
        value = value.map(clone);
      } else if (Array.isArray(value)) {
        value = value.map(clone);
      } else if (value.constructor === Object) {
        value = clone(value);
      }
    }

    result[key] = value;
  }

  return result as T;
}
