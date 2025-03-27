import { parse, type Rule } from 'postcss';
import collapseAdjacentRulesImport from 'tailwindcss/lib/lib/collapseAdjacentRules';
import collapseDuplicateDeclarationsImport from 'tailwindcss/lib/lib/collapseDuplicateDeclarations';
import evaluateTailwindFunctionsImport from 'tailwindcss/lib/lib/evaluateTailwindFunctions';
import expandApplyAtRulesImport from 'tailwindcss/lib/lib/expandApplyAtRules';
import expandTailwindAtRulesImport from 'tailwindcss/lib/lib/expandTailwindAtRules';
import { generateRules as rawGenerateRules } from 'tailwindcss/lib/lib/generateRules';
import partitionApplyAtRulesImport from 'tailwindcss/lib/lib/partitionApplyAtRules';
import resolveDefaultsAtRulesImport from 'tailwindcss/lib/lib/resolveDefaultsAtRules';
import substituteScreenAtRulesImport from 'tailwindcss/lib/lib/substituteScreenAtRules';
import type { TailwindConfig } from '../../tailwind';
import { resolveAllCSSVariables } from '../css/resolve-all-css-variables';
import { setupTailwindContext } from './setup-tailwind-context';

const substituteScreenAtRules = substituteScreenAtRulesImport.default;
const resolveDefaultsAtRules = resolveDefaultsAtRulesImport.default;
const partitionApplyAtRules = partitionApplyAtRulesImport.default;
const expandTailwindAtRules = expandTailwindAtRulesImport.default;
const expandApplyAtRules = expandApplyAtRulesImport.default;
const evaluateTailwindFunctions = evaluateTailwindFunctionsImport.default;
const collapseDuplicateDeclarations =
  collapseDuplicateDeclarationsImport.default;
const collapseAdjacentRules = collapseAdjacentRulesImport.default;

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
