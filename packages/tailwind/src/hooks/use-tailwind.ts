import type { Rule } from "postcss";
import { parse } from "postcss";
import evaluateTailwindFunctions from "tailwindcss/lib/lib/evaluateTailwindFunctions";
import expandApplyAtRules from "tailwindcss/lib/lib/expandApplyAtRules";
import resolveDefaultsAtRules from "tailwindcss/lib/lib/resolveDefaultsAtRules";
import { generateRules as rawGenerateRules } from "tailwindcss/lib/lib/generateRules";
import expandTailwindAtRules from "tailwindcss/lib/lib/expandTailwindAtRules";
import partitionApplyAtRules from "tailwindcss/lib/lib/partitionApplyAtRules";
import substituteScreenAtRules from "tailwindcss/lib/lib/substituteScreenAtRules";
import { setupTailwindContext } from "../utils/tailwindcss/setup-tailwind-context";
import type { TailwindConfig } from "../tailwind";
import { resolveAllCSSVariables } from "../utils/css/resolve-all-css-variables";

const tailwindAtRulesRoot = parse(
  `
  @tailwind base;
  @tailwind components;
`,
).root();

export function useTailwind(config: TailwindConfig) {
  const tailwindContext = setupTailwindContext(config);

  return {
    // inspired by the tailwind LSP server
    generateRootForClasses: (classes: string[]) => {
      const bigIntRuleTuples: [bigint, Rule][] = rawGenerateRules(
        new Set(classes),
        tailwindContext,
      );

      const root = tailwindAtRulesRoot
        .clone()
        .append(...bigIntRuleTuples.map(([, rule]) => rule));
      partitionApplyAtRules()(root);
      expandTailwindAtRules(tailwindContext)(root);
      expandApplyAtRules(tailwindContext)(root);
      evaluateTailwindFunctions(tailwindContext)(root);
      substituteScreenAtRules(tailwindContext)(root);
      resolveDefaultsAtRules(tailwindContext)(root);

      resolveAllCSSVariables(root);

      return root;
    },
  };
}
