import { type CssNode, clone, List, type Rule } from 'css-tree';
import { isPartInlinable } from './is-part-inlinable';

/**
 * Split a rule into inlinable and non-inlinable parts. Caller must only pass rules
 * for which isRuleInlinable(rule) is false. Returns clones so the original stylesheet is never mutated.
 *
 * @returns inlinablePart: rule with only inlinable block children, or null if none.
 *          nonInlinablePart: rule with only non-inlinable block children (full clone when no split).
 */
export function splitMixedRule(rule: Rule): {
  inlinablePart: Rule | null;
  nonInlinablePart: Rule;
} {
  const ruleCloneInlinable = clone(rule) as Rule;
  const ruleCloneNonInlinable = clone(rule) as Rule;

  const inlinableParts: CssNode[] = [];
  const nonInlinableParts: CssNode[] = [];

  for (const part of ruleCloneInlinable.block.children.toArray()) {
    if (isPartInlinable(part)) {
      inlinableParts.push(part);
    } else {
      nonInlinableParts.push(part);
    }
  }

  const inlinablePart =
    inlinableParts.length > 0
      ? {
          ...ruleCloneInlinable,
          block: {
            type: 'Block' as const,
            children: new List<CssNode>().fromArray(inlinableParts),
          },
        }
      : null;

  const nonInlinablePart =
    nonInlinableParts.length > 0
      ? {
          ...ruleCloneNonInlinable,
          block: {
            type: 'Block' as const,
            children: new List<CssNode>().fromArray(nonInlinableParts),
          },
        }
      : ruleCloneNonInlinable;

  return { inlinablePart, nonInlinablePart };
}
