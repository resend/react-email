/* eslint-disable @typescript-eslint/no-unused-vars */

declare module 'patched-tailwindcss/lib/lib/evaluateTailwindFunctions' {
  import type { JitContext } from 'patched-tailwindcss/lib/lib/setupContextUtils';
  import type { Root } from 'patched-postcss';

  export default function evaluateTailwindFunctions(
    context: JITContext,
  ): (root: Root) => void;
}

declare module 'patched-tailwindcss/lib/lib/resolveDefaultsAtRules' {
  import type { JitContext } from 'patched-tailwindcss/lib/lib/setupContextUtils';
  import type { Root } from 'patched-postcss';

  export default function expandApplyAtRules(
    context: JITContext,
  ): (root: Root) => void;
}

declare module 'patched-tailwindcss/lib/lib/partitionApplyAtRules' {
  import type { Root } from 'patched-postcss';

  export default function partitionApplyAtRules(): (root: Root) => void;
}

declare module 'patched-tailwindcss/lib/lib/substituteScreenAtRules' {
  import type { Root } from 'patched-postcss';

  export default function substituteScreenAtRules(
    context: JITContext,
  ): (root: Root) => void;
}

declare module 'patched-tailwindcss/lib/lib/resolveDefaultsAtRules' {
  import type { JitContext } from 'patched-tailwindcss/lib/lib/setupContextUtils';
  import type { Root } from 'patched-postcss';

  export default function expandApplyAtRules(
    context: JITContext,
  ): (root: Root) => void;
}

declare module 'patched-tailwindcss/lib/lib/expandApplyAtRules' {
  import type { JitContext } from 'patched-tailwindcss/lib/lib/setupContextUtils';
  import type { Root } from 'patched-postcss';

  export default function expandApplyAtRules(
    context: JITContext,
  ): (root: Root) => void;
}

declare module 'patched-tailwindcss/lib/lib/expandTailwindAtRules' {
  import type { JitContext } from 'patched-tailwindcss/lib/lib/setupContextUtils';
  import type { Root } from 'patched-postcss';

  export default async function expandTailwindAtRules(
    context: JITContext,
  ): (root: Root) => Promise<void>;
}

declare module 'patched-tailwindcss/lib/lib/collapseAdjacentRules' {
  import type { JitContext } from 'patched-tailwindcss/lib/lib/setupContextUtils';
  import type { Root } from 'patched-postcss';

  export default async function collapseAdjacentRules(
    context: JITContext,
  ): (root: Root) => void;
}

declare module 'patched-tailwindcss/lib/lib/collapseDuplicateDeclarations' {
  import type { JitContext } from 'patched-tailwindcss/lib/lib/setupContextUtils';
  import type { Root } from 'patched-postcss';

  export default async function collapseDuplicateDeclarations(
    context: JITContext,
  ): (root: Root) => void;
}

declare module 'patched-tailwindcss/lib/lib/generateRules' {
  import type { JitContext } from 'patched-tailwindcss/lib/lib/setupContextUtils';
  import type { Rule } from 'patched-postcss';

  export function generateRules(
    classNames: Set<string>,
    context: JITContext,
  ): [bigint, Rule][];
}

// taken from https://github.com/vinicoder/tw-to-css/blob/main/types.d.ts
// thanks vinicoder!
declare module 'patched-tailwindcss/lib/lib/setupContextUtils' {
  import type { Container, Node } from 'patched-postcss';
  import type { Config } from 'patched-tailwindcss';
  import type resolveConfig from 'patched-tailwindcss/resolveConfig';

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
    ruleCache: Set<unknown>;
    candidateRuleCache: Map<unknown, unknown>;
    classCache: Map<unknown, unknown>;
    applyClassCache: Map<unknown, unknown>;
    notClassCache: Set<unknown>;
    postCssNodeCache: Map<unknown, unknown>;

    getClassList: () => string[];
    tailwindConfig: TailwindConfig;
    variantMap: Map<VariantName, VariantFn[]>;
  }

  export function createContext(
    config: ReturnType<typeof resolveConfig>,
    changedContent?: ChangedContent[],
  ): JitContext;
}
