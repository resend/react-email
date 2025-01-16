import type { Root } from 'postcss';
import { removeIfEmptyRecursively } from './remove-if-empty-recursively';

export const removeRuleDuplicatesFromRoot = (root: Root) => {
  root.walkRules((rule) => {
    root.walkRules(rule.selector, (duplicateRule) => {
      if (duplicateRule === rule) return;

      const parent = duplicateRule.parent;
      duplicateRule.remove();
      if (parent) {
        removeIfEmptyRecursively(parent);
      }
    });
  });
};
