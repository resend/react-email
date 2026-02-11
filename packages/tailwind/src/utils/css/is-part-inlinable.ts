import { type CssNode, find } from 'css-tree';

export function isPartInlinable(part: CssNode): boolean {
  const hasAtRuleInside = find(part, (node) => node.type === 'Atrule') !== null;

  const hasPseudoSelector =
    find(
      part,
      (node) =>
        node.type === 'PseudoClassSelector' ||
        node.type === 'PseudoElementSelector',
    ) !== null;

  return !hasAtRuleInside && !hasPseudoSelector;
}
