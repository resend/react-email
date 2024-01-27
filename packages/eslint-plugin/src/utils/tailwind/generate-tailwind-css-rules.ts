import type { Root, Rule } from "postcss";
import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
import postcss from "postcss";
import evaluateTailwindFunctionsImport from "tailwindcss/lib/lib/evaluateTailwindFunctions";
import { generateRules as rawGenerateRules } from "tailwindcss/lib/lib/generateRules";

const evaluateTailwindFunctions = 'default' in evaluateTailwindFunctionsImport
  // sometimes the default export comes in as the functions
  // sometimes it comes in as an object with the function on the default property 🤷
  ? evaluateTailwindFunctionsImport.default
  : evaluateTailwindFunctionsImport;

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
