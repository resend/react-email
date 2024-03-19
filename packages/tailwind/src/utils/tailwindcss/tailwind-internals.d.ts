/* eslint-disable @typescript-eslint/no-unused-vars */

declare module "tailwindcss/lib/lib/evaluateTailwindFunctions" {
  import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
  import type { Root } from "postcss";

  export default function evaluateTailwindFunctions(
    context: JITContext,
  ): (root: Root) => void;
}

declare module "tailwindcss/lib/lib/resolveDefaultsAtRules" {
  import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
  import type { Root } from "postcss";

  export default function expandApplyAtRules(
    context: JITContext,
  ): (root: Root) => void;
}

declare module "tailwindcss/lib/lib/partitionApplyAtRules" {
  import type { Root } from "postcss";

  export default function partitionApplyAtRules(): (root: Root) => void;
}

declare module "tailwindcss/lib/lib/substituteScreenAtRules" {
  import type { Root } from "postcss";

  export default function substituteScreenAtRules(
    context: JITContext,
  ): (root: Root) => void;
}

declare module "tailwindcss/lib/lib/resolveDefaultsAtRules" {
  import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
  import type { Root } from "postcss";

  export default function expandApplyAtRules(
    context: JITContext,
  ): (root: Root) => void;
}

declare module "tailwindcss/lib/lib/expandApplyAtRules" {
  import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
  import type { Root } from "postcss";

  export default function expandApplyAtRules(
    context: JITContext,
  ): (root: Root) => void;
}

declare module "tailwindcss/lib/lib/expandTailwindAtRules" {
  import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
  import type { Root } from "postcss";

  export default function expandTailwindAtRules(
    context: JITContext,
  ): (root: Root) => void;
}

declare module "tailwindcss/lib/lib/generateRules" {
  import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
  import type { Rule } from "postcss";

  export function generateRules(
    classNames: Set<string>,
    context: JITContext,
  ): [bigint, Rule][];
}

// taken from https://github.com/vinicoder/tw-to-css/blob/main/types.d.ts
// thanks vinicoder!
declare module "tailwindcss/lib/lib/setupContextUtils" {
  import type { Container, Node } from "postcss";
  import type { Config } from "tailwindcss";
  import type resolveConfig from "tailwindcss/resolveConfig";

  interface ChangedContent {
    content: string;
    extension?: string;
  }

  interface Api {
    container: Container;
    separator: string;
    format: (def: string) => void;
    wrap: (rule: Container) => void;
  }

  type VariantPreview = string;

  type VariantFn = [number, (api: Api) => VariantPreview | undefined];

  type VariantName = string;

  export interface JitContext {
    changedContent: ChangedContent[];
    getClassList: () => string[];
    tailwindConfig: TailwindConfig;
    variantMap: Map<VariantName, VariantFn[]>;
  }

  export function createContext(
    config: ReturnType<typeof resolveConfig>,
    changedContent?: ChangedContent[],
  ): JitContext;
}
