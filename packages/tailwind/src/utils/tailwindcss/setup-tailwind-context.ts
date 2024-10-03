import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
import { createContext } from "tailwindcss/lib/lib/setupContextUtils";
import resolveConfig from "tailwindcss/resolveConfig";
import type { TailwindConfig } from "../../tailwind";

export const setupTailwindContext = (config: TailwindConfig) => {
  return createContext(
    resolveConfig({
      ...config,
      content: [],
      corePlugins: {
        preflight: false,
      },
    }),
  );
};

export const resetTailwindCache = (context: JitContext) => {
  //context.ruleCache = new Set();
  //context.classCache = new Map();
  //context.applyClassCache = new Map();
  //context.notClassCache = new Set();
  //context.postCssNodeCache = new Map();
  context.candidateRuleCache = new Map();
};
