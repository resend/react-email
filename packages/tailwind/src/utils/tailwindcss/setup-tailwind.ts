import postcss from 'postcss';
import collapseAdjacentRules from 'tailwindcss/lib/lib/collapseAdjacentRules';
import collapseDuplicateDeclarations from 'tailwindcss/lib/lib/collapseDuplicateDeclarations';
import evaluateTailwindFunctions from 'tailwindcss/lib/lib/evaluateTailwindFunctions';
import expandApplyAtRules from 'tailwindcss/lib/lib/expandApplyAtRules';
import expandTailwindAtRules from 'tailwindcss/lib/lib/expandTailwindAtRules';
import { generateRules as rawGenerateRules } from 'tailwindcss/lib/lib/generateRules';
import partitionApplyAtRules from 'tailwindcss/lib/lib/partitionApplyAtRules';
import resolveDefaultsAtRules from 'tailwindcss/lib/lib/resolveDefaultsAtRules';
import substituteScreenAtRules from 'tailwindcss/lib/lib/substituteScreenAtRules';
import { resolveAllCSSVariables } from '../css/resolve-all-css-variables';
import {
  setupTailwindContext,
  type TailwindConfig,
} from './setup-tailwind-context';

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

      return root;
    },
  };
}
