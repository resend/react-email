import type { Root, Rule } from "postcss";
import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
import postcss from "postcss";
import evalImport from "tailwindcss/lib/lib/evaluateTailwindFunctions";
import { generateRules as rawGenerateRules } from "tailwindcss/lib/lib/generateRules";

// weirdly, after compilation, tailwind default exports an object with a default property
const evaluateTailwindFunctions = evalImport.default;

export const generateTailwindCssRules = (
  classNames: string[],
  tailwindContext: JitContext,
): { root: Root; rules: Rule[] } => {
  // inspired by the tailwind LSP server
  const bigIntRuleTuples: [bigint, Rule][] = rawGenerateRules(
    new Set(classNames),
    tailwindContext,
  );

  const root = postcss.root({
    nodes: bigIntRuleTuples.map(([, rule]) => rule),
  });
  evaluateTailwindFunctions(tailwindContext)(root);

  const actualRules: Rule[] = [];
  root.walkRules((rule) => {
    actualRules.push(rule);
  });

  return {
    root,
    rules: actualRules,
  };
};
