import { type CssNode, type Rule, string, walk } from 'css-tree';
import { isRuleInlinable } from './is-rule-inlinable.js';
import { splitMixedRule } from './split-mixed-rule.js';

export function extractRulesPerClass(root: CssNode, classes: string[]) {
  const classSet = new Set(classes);

  const inlinableRules = new Map<string, Rule>();
  const nonInlinableRules = new Map<string, Rule>();
  walk(root, {
    visit: 'Rule',
    enter(rule) {
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
      if (isRuleInlinable(rule)) {
        for (const className of selectorClasses) {
          if (classSet.has(className)) {
            inlinableRules.set(className, rule);
          }
        }
      } else {
        const { inlinablePart, nonInlinablePart } = splitMixedRule(rule);
        for (const className of selectorClasses) {
          if (!classSet.has(className)) continue;
          if (inlinablePart) {
            inlinableRules.set(className, inlinablePart);
          }
          if (nonInlinablePart) {
            nonInlinableRules.set(className, nonInlinablePart);
          }
        }
      }
    },
  });
  return {
    inlinable: inlinableRules,
    nonInlinable: nonInlinableRules,
  };
}
