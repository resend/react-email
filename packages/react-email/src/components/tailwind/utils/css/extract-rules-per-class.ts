import {
  type Atrule,
  type CssNode,
  clone,
  List,
  type Rule,
  string,
  walk,
} from 'css-tree';
import { NON_INLINABLE_ATRULES } from './constants.js';
import { isRuleInlinable } from './is-rule-inlinable.js';
import { splitMixedRule } from './split-mixed-rule.js';

/**
 * Re-nest the at-rule(s) back inside the rule so the pipeline stays
 * version-agnostic across Tailwind's variant shape change.
 * See https://github.com/resend/react-email/issues/3662
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
      prelude: atRule.prelude
        ? (clone(atRule.prelude) as Atrule['prelude'])
        : null,
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

  // A plain-looking rule inside these wrappers is still conditional and must
  // not be inlined. See https://github.com/resend/react-email/issues/3662
  const enclosingAtRules: Atrule[] = [];

  const handleRule = (rule: Rule) => {
    // A nested rule (e.g. group/peer's `&:is(:where(.group):hover *)`) belongs
    // to its parent utility; processing it standalone emits a bare, parentless
    // `&` rule into the <style> block, so skip it here.
    const firstSelector =
      rule.prelude.type === 'SelectorList' ? rule.prelude.children.first : null;
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
