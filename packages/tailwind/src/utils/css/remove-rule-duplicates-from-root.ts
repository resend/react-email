import { type CssNode, generate, type StyleSheet, walk } from 'css-tree';

export const removeRuleDuplicatesFromRoot = (root: StyleSheet) => {
  walk(root, {
    visit: 'Rule',
    enter(rule) {
      const path: CssNode[] = [];

      walk(root, {
        visit: 'Rule',
        enter(otherRule, item, list) {
          if (rule === otherRule) return;
          if (generate(rule.prelude) === generate(otherRule.prelude)) {
            list.remove(item);
          }
          path.unshift(otherRule);
        },
        leave() {
          path.shift();
        },
      });
    },
  });
};
