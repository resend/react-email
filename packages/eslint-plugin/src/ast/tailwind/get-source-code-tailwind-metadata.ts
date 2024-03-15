import type { SourceCode } from "@typescript-eslint/utils/ts-eslint";
import { type TSESTree } from "@typescript-eslint/utils";
import esquery from "esquery";
import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
import {
  setupTailwindContext,
  type TailwindComponentConfig,
} from "./setup-tailwind-context";
import { getTailwindConfigFromSourceCode } from "./get-tailwind-config-from-source-code";

let tailwindContext: JitContext | undefined;

export const getSourceCodeTailwindMetadata = (
  sourceCode: SourceCode,
):
  | { hasTailwind: false }
  | {
      hasTailwind: true;
      tailwindConfig: TailwindComponentConfig;
      tailwindContext: JitContext;
    } => {
  const tailwindComponentNode = esquery(
    sourceCode.ast,
    'JSXOpeningElement[name.name="Tailwind"]',
  )[0] as TSESTree.JSXOpeningElement | undefined;

  if (typeof tailwindComponentNode === "undefined") {
    return {
      hasTailwind: false,
    };
  }

  const tailwindConfig = getTailwindConfigFromSourceCode(sourceCode);

  if (typeof tailwindContext === "undefined")
    tailwindContext = setupTailwindContext(tailwindConfig);

  return {
    hasTailwind: true,
    tailwindContext,
    tailwindConfig,
  };
};
