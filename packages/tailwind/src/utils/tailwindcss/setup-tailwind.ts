import postcss from 'postcss';

const {
  default: collapseAdjacentRules,
} = require('tailwindcss/lib/lib/collapseAdjacentRules');
const {
  default: collapseDuplicateDeclarations,
} = require('tailwindcss/lib/lib/collapseDuplicateDeclarations');
const {
  default: evaluateTailwindFunctions,
} = require('tailwindcss/lib/lib/evaluateTailwindFunctions');
const {
  default: expandApplyAtRules,
} = require('tailwindcss/lib/lib/expandApplyAtRules');
const {
  default: expandTailwindAtRules,
} = require('tailwindcss/lib/lib/expandTailwindAtRules');

import { generateRules as rawGenerateRules } from 'tailwindcss/lib/lib/generateRules';

const {
  default: partitionApplyAtRules,
} = require('tailwindcss/lib/lib/partitionApplyAtRules');
const {
  default: resolveDefaultsAtRules,
} = require('tailwindcss/lib/lib/resolveDefaultsAtRules');
const {
  default: substituteScreenAtRules,
} = require('tailwindcss/lib/lib/substituteScreenAtRules');

import { resolveAllCSSVariables } from '../css/resolve-all-css-variables';
import {
  setupTailwindContext,
  type TailwindConfig,
} from './setup-tailwind-context';
import { removeRuleDuplicatesFromRoot } from '../css/remove-rule-duplicates-from-root';
import { sanitizeDeclarations } from '../css/sanitize-declarations';

console.log({
  partitionApplyAtRules,
  expandTailwindAtRules,
  expandApplyAtRules,
  evaluateTailwindFunctions,
  substituteScreenAtRules,
  resolveDefaultsAtRules,
  collapseAdjacentRules,
});

export function setupTailwind(config: TailwindConfig) {
  const tailwindContext = setupTailwindContext(config);
  return {
    createDefaultRoot(): postcss.Root {
      return postcss.parse('@tailwind base; @tailwind components;').root();
    },
    /**
     * This shuld also be fine to be called multiple times with
     */
    generateRules(classes: Set<string>): postcss.Rule[] {
      const bigIntRuleTuples: [bigint, postcss.Rule][] = rawGenerateRules(
        new Set(classes),
        tailwindContext,
      );

      return bigIntRuleTuples.map(([, rule]) => rule);
    },
    processTailwindFeatures: (root: postcss.Root) => {
      partitionApplyAtRules()(root);
      // This is a promise, but we don't need to await it because the internal await is never actually called out
      // because of there not being any `changedContent` files on the context
      expandTailwindAtRules(tailwindContext)(root);
      partitionApplyAtRules()(root);
      expandApplyAtRules(tailwindContext)(root);
      evaluateTailwindFunctions(tailwindContext)(root);
      substituteScreenAtRules(tailwindContext)(root);
      resolveDefaultsAtRules(tailwindContext)(root);
      collapseAdjacentRules(tailwindContext)(root);
      collapseDuplicateDeclarations(tailwindContext)(root);

      resolveAllCSSVariables(root);
      removeRuleDuplicatesFromRoot(root);
      sanitizeDeclarations(root);

      return root;
    },
  };
}
