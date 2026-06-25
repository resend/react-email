import { find, type Rule } from 'css-tree';

export function isRuleInlinable(rule: Rule): boolean {
  const hasAtRuleInside = find(rule, (node) => node.type === 'Atrule') !== null;

  const hasPseudoSelector =
    find(
      rule,
      (node) =>
        node.type === 'PseudoClassSelector' ||
        node.type === 'PseudoElementSelector',
    ) !== null;

  // css-tree leaves a nested rule body (space-y/divide compile to
  // `:where(& > :not(:last-child)) { … }`) as an unparsed Raw block child that
  // find() can't descend into; such a rule can't be inlined as flat styles.
  let hasNestedRuleBlock = false;
  for (const child of rule.block.children) {
    if (child.type === 'Raw') {
      hasNestedRuleBlock = true;
      break;
    }
  }

  return !hasAtRuleInside && !hasPseudoSelector && !hasNestedRuleBlock;
}
