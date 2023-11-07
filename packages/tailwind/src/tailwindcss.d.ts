declare module "tailwindcss/src/lib/expandApplyAtRules.js" {
  export default function expandApplyAtRules(): void;
}

declare module "tailwindcss/src/lib/generateRules.js" {
  export function generateRules(): void;
}

declare module "tailwindcss/src/lib/setupContextUtils.js" {
  import type postcss, { Container } from "postcss";
  import type { Config as TailwindConfig } from "tailwindcss";

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
    config: TailwindConfig,
    changedContent?: ChangedContent[],
    root?: postcss.Root
  ): JitContext;
}

declare module "tailwindcss/src/public/resolve-config.js" {
  import type { Config as TailwindConfig } from "tailwindcss";

  export default function resolveConfig(tailwindConfig: TailwindConfig): TailwindConfig;
}

declare module "tailwindcss/src/processTailwindFeatures.js" {
  import type { AtRule, Plugin, Result, Root } from "postcss";
  import type { ChangedContent, JitContext } from "tailwindcss/src/lib/setupContextUtils.js";
  import type { Config as TailwindConfig } from "tailwindcss";

  type SetupContext = (root: Root, result: Result) => JitContext;

  interface ProcessTailwindFeaturesCallbackOptions {
    applyDirectives: Set<AtRule>;
    createContext: (config: TailwindConfig, changedContent: ChangedContent[]) => JitContext;
    registerDependency: () => unknown;
    tailwindDirectives: Set<string>;
  }

  export default function processTailwindFeatures(
    callback: (options: ProcessTailwindFeaturesCallbackOptions) => SetupContext
  ): Plugin;
}
