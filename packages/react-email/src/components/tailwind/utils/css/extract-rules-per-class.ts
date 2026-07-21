import {
  type Atrule,
  clone,
  type CssNode,
  List,
  type Rule,
  string,
  walk,
} from 'css-tree';
import { isRuleInlinable } from './is-rule-inlinable.js';
import { splitMixedRule } from './split-mixed-rule.js';

// At-rules whose contents are conditional and therefore can never be inlined
// onto an element (e.g. `@media (prefers-color-scheme: dark)`).
const NON_INLINABLE_ATRULES = new Set(['media', 'supports']);

/**
 * Rebuild a rule that Tailwind emitted *inside* a non-inlinable at-rule wrapper
 * so the at-rule(s) are nested back *inside* the rule instead.
 *
 * Tailwind <=4.3.2 nested the at-rule within the rule:
 *   `.dark\:bg-black { @media (prefers-color-scheme: dark) { ... } }`
 * Tailwind >=4.3.3 inverted it, wrapping the rule with the at-rule:
 *   `@media (prefers-color-scheme: dark) { .dark\:bg-black { ... } }`
 *
 * Normalizing to the older shape keeps the rest of the pipeline
 * (`downlevelForEmailClients`, etc.) working the same for every Tailwind
 * version.
 */
function nestAtRulesInsideRule(rule: Rule, enclosingAtRules: Atrule[]): Rule {
  const ruleClone = clone(rule) as Rule;
  let children = ruleClone.block.children;

  // Wrap from the innermost enclosing at-rule outward.
  for (let i = enclosingAtRules.length - 1; i >= 0; i--) {
    const atRule = enclosingAtRules[i]!;
    const wrapped: Atrule = {
      type: 'Atrule',
      name: atRule.name,
      prelude: atRule.prelude ? (clone(atRule.prelude) as Atrule['prelude']) : null,
      block: {
        type: 'Block',
        children,
      },
    };
    children = new List<CssNode>().fromArray([wrapped]);
  }

  return {
    type: 'Rule',
    prelude: clone(rule.prelude) as Rule['prelude'],
    block: {
      type: 'Block',
      children,
    },
  };
}

export function extractRulesPerClass(root: CssNode, classes: string[]) {
  const classSet = new Set(classes);

  // A class can be defined by multiple rules (e.g. a preset and a child config
  // override), so keep them all to merge instead of the last one clobbering.
  const inlinableRules = new Map<string, Rule[]>();
  const nonInlinableRules = new Map<string, Rule[]>();

  const appendRule = (
    map: Map<string, Rule[]>,
    className: string,
    rule: Rule,
  ) => {
    const existing = map.get(className);
    if (existing) {
      existing.push(rule);
    } else {
      map.set(className, [rule]);
    }
  };

  // Chain of enclosing at-rules that force their contents to be non-inlinable.
  // Tailwind >=4.3.3 emits variant utilities (e.g. `dark:`) as class rules
  // nested inside these wrappers, so a rule found here must be treated as
  // non-inlinable even though the rule itself looks plain.
  const enclosingAtRules: Atrule[] = [];

  const handleRule = (rule: Rule) => {
    // A nested rule (e.g. group/peer's `&:is(:where(.group):hover *)`) belongs
    // to its parent utility; processing it standalone emits a bare, parentless
    // `&` rule into the <style> block, so skip it here.
    const firstSelector =
      rule.prelude.type === 'SelectorList'
        ? rule.prelude.children.first
        : null;
    if (
      firstSelector?.type === 'Selector' &&
      firstSelector.children.first?.type === 'NestingSelector'
    ) {
      return;
    }

    // Only the prelude names the class that owns the rule; classes referenced
    // inside the block (e.g. `.group` in `:where(.group)`) must not key it.
    const selectorClasses: string[] = [];
    walk(rule.prelude, {
      visit: 'ClassSelector',
      enter(classSelector) {
        selectorClasses.push(string.decode(classSelector.name));
      },
    });

    // The rule sits inside an @media/@supports wrapper (Tailwind >=4.3.3). The
    // declarations only apply in that condition, so treat the whole thing as
    // non-inlinable after normalizing it to the nested-at-rule shape.
    if (enclosingAtRules.length > 0) {
      const nonInlinablePart = nestAtRulesInsideRule(rule, enclosingAtRules);
      for (const className of selectorClasses) {
        if (classSet.has(className)) {
          appendRule(nonInlinableRules, className, nonInlinablePart);
        }
      }
      return;
    }

    if (isRuleInlinable(rule)) {
      for (const className of selectorClasses) {
        if (classSet.has(className)) {
          appendRule(inlinableRules, className, rule);
        }
      }
    } else {
      const { inlinablePart, nonInlinablePart } = splitMixedRule(rule);
      for (const className of selectorClasses) {
        if (!classSet.has(className)) continue;
        if (inlinablePart) {
          appendRule(inlinableRules, className, inlinablePart);
        }
        if (nonInlinablePart) {
          appendRule(nonInlinableRules, className, nonInlinablePart);
        }
      }
    }
  };

  walk(root, {
    enter(node) {
      if (node.type === 'Atrule') {
        if (NON_INLINABLE_ATRULES.has(node.name.toLowerCase())) {
          enclosingAtRules.push(node);
        }
      } else if (node.type === 'Rule') {
        handleRule(node);
      }
    },
    leave(node) {
      if (
        node.type === 'Atrule' &&
        NON_INLINABLE_ATRULES.has(node.name.toLowerCase())
      ) {
        enclosingAtRules.pop();
      }
    },
  });

  return {
    inlinable: inlinableRules,
    nonInlinable: nonInlinableRules,
  };
}
