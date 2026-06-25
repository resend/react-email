import { type CssNode, find } from 'css-tree';

export function isPartInlinable(part: CssNode): boolean {
  // A nested rule body css-tree left unparsed (space-y/divide's
  // `:where(& > :not(:last-child)) { … }`) arrives here as a Raw block child;
  // it has no flat declarations to inline, so keep it in the <style> output.
  if (part.type === 'Raw') {
    return false;
  }

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
