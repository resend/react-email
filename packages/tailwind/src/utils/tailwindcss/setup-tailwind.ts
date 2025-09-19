import type { Rule } from 'postcss';
import { parse } from 'postcss';
import collapseAdjacentRules from 'tailwindcss/lib/lib/collapseAdjacentRules';
import collapseDuplicateDeclarations from 'tailwindcss/lib/lib/collapseDuplicateDeclarations';
import evaluateTailwindFunctions from 'tailwindcss/lib/lib/evaluateTailwindFunctions';
import expandApplyAtRules from 'tailwindcss/lib/lib/expandApplyAtRules';
import expandTailwindAtRules from 'tailwindcss/lib/lib/expandTailwindAtRules';
import { generateRules as rawGenerateRules } from 'tailwindcss/lib/lib/generateRules';
import partitionApplyAtRules from 'tailwindcss/lib/lib/partitionApplyAtRules';
import resolveDefaultsAtRules from 'tailwindcss/lib/lib/resolveDefaultsAtRules';
import substituteScreenAtRules from 'tailwindcss/lib/lib/substituteScreenAtRules';
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
  // See https://github.com/resend/react-email/issues/1907#issuecomment-2668720428
  if ('safelist' in config) {
    console.warn(
      'The `safelist` option is not supported in the `Tailwind` component, it will not change any behavior.',
    );
    delete config.safelist;
  }
  const tailwindContext = setupTailwindContext(config);
  return {
    generateRootForClasses: (classes: string[]) => {
      tailwindContext.candidateRuleCache = new Map();
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
      collapseAdjacentRules()(root);
      collapseDuplicateDeclarations()(root);

      resolveAllCSSVariables(root);

      return root;
    },
  };
}
