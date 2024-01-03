import type { Root, Rule } from "postcss";
import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
import postcssCssVariables from "postcss-css-variables";
import postcss from "postcss";
import evaluateTailwindFunctions from "tailwindcss/lib/lib/evaluateTailwindFunctions";
import expandApplyAtRules from "tailwindcss/lib/lib/expandApplyAtRules";
import resolveDefaultsAtRules from "tailwindcss/lib/lib/resolveDefaultsAtRules";
import { generateRules as rawGenerateRules } from "tailwindcss/lib/lib/generateRules";
import expandTailwindAtRules from "tailwindcss/lib/lib/expandTailwindAtRules";
import partitionApplyAtRules from "tailwindcss/lib/lib/partitionApplyAtRules";
import substituteScreenAtRules from "tailwindcss/lib/lib/substituteScreenAtRules";

const tailwindAtRulesRoot = postcss
  .parse(
    `
  @tailwind base;
  @tailwind components;
`,
  )
  .root();

const postcssVariablesProcessor = postcss([postcssCssVariables()]);

export const generatePostcssRootForClasses = (
  classes: string[],
  tailwindContext: JitContext,
): Root => {
  // inspired by the tailwind LSP server
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

  return postcssVariablesProcessor
    .process(root.toString())
    .sync()
    .root as postcss.Root;
};
