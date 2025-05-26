import type { Root, Rule } from 'postcss';
import postcss from 'postcss';
import evaluateTailwindFunctions from 'tailwindcss/lib/lib/evaluateTailwindFunctions';
import { generateRules as rawGenerateRules } from 'tailwindcss/lib/lib/generateRules';
import type { JitContext } from 'tailwindcss/lib/lib/setupContextUtils';

export const generateTailwindCssRules = (
  classNames: string[],
  tailwindContext: JitContext,
): { root: Root; rules: Rule[] } => {
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
