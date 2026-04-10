import type { Raw, Value } from 'css-tree';

export function unwrapValue(value: Value | Raw) {
  if (value.type === 'Value' && value.children.size === 1) {
    return value.children.first ?? value;
  }

  return value;
}
