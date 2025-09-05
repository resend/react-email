import { find, type Rule } from 'css-tree';

export function isRuleInlinable(rule: Rule): boolean {
  const hasAtRuleInside = find(rule, (node) => node.type === 'Atrule') !== null;

  const hasPseudoSelector =
    find(
      rule.prelude,
      (node) =>
        node.type === 'PseudoClassSelector' ||
        node.type === 'PseudoElementSelector',
    ) !== null;

  return !hasAtRuleInside && !hasPseudoSelector;
}
