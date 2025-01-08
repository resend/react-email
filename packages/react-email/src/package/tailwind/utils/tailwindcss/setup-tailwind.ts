import type { Rule } from 'patched-postcss';
import parse from 'patched-postcss/lib/parse';
import evaluateTailwindFunctions from 'patched-tailwindcss/lib/lib/evaluateTailwindFunctions';
import expandApplyAtRules from 'patched-tailwindcss/lib/lib/expandApplyAtRules';
import resolveDefaultsAtRules from 'patched-tailwindcss/lib/lib/resolveDefaultsAtRules';
import { generateRules as rawGenerateRules } from 'patched-tailwindcss/lib/lib/generateRules';
import expandTailwindAtRules from 'patched-tailwindcss/lib/lib/expandTailwindAtRules';
import partitionApplyAtRules from 'patched-tailwindcss/lib/lib/partitionApplyAtRules';
import substituteScreenAtRules from 'patched-tailwindcss/lib/lib/substituteScreenAtRules';
import collapseAdjacentRules from 'patched-tailwindcss/lib/lib/collapseAdjacentRules';
import collapseDuplicateDeclarations from 'patched-tailwindcss/lib/lib/collapseDuplicateDeclarations';
import type { TailwindConfig } from '../../tailwind';
import { resolveAllCSSVariables } from '../css/resolve-all-css-variables';
import { setupTailwindContext } from './setup-tailwind-context';

const tailwindAtRulesRoot = parse(
  `
  @tailwind base;
  @tailwind components;
`,
).root();

export function setupTailwind(config: TailwindConfig) {
  const tailwindContext = setupTailwindContext(config);
  return {
    generateRootForClasses: (classes: string[]) => {
      const bigIntRuleTuples: [bigint, Rule][] = rawGenerateRules(
        new Set(classes),
        tailwindContext,
      );

      const root = tailwindAtRulesRoot
        .clone()
        .append(...bigIntRuleTuples.map(([, rule]) => rule));
      partitionApplyAtRules()(root);
      // This is fine because the internal await is never actually called out
      // because of there not being any `changedContent` files on the context
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
