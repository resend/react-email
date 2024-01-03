import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
import selectorParser from "postcss-selector-parser";
import { type AtRule } from "postcss";
import { cssRulesForElement } from "./css-rules-for-element";
import { sanitizePostcssRootForEmailStyles } from "./sanitize-postcss-root-for-email-styles";

const camelCase = (string: string) =>
  string.replace(/-(\w|$)/g, (_, p1: string) => p1.toUpperCase());

export const reactStylesForElement = (
  element: React.ReactElement<{ className: string }>,
  context: JitContext,
): {
  inlineStyles: React.CSSProperties;
  tailwindClassNames: string[];
  mediaQueryRules: AtRule[];
} => {
  const stylesRoot = sanitizePostcssRootForEmailStyles(cssRulesForElement(element, context));

  const inlineStyles: Record<string, unknown> = {};
  const tailwindClassNames = [] as string[];

  stylesRoot.walkRules((rule) => {
    if (rule.parent?.type === 'atrule') return;

    selectorParser((selectors) => {
      selectors.walkClasses((className) => {
        tailwindClassNames.push(className.value);
      });
    }).processSync(rule.selector);
  });

  stylesRoot.walkDecls((decl) => {
    if (decl.parent?.parent?.type === "atrule") return;

    inlineStyles[camelCase(decl.prop)] = decl.value;
  });

  const mediaQueryRules = [] as AtRule[];

  stylesRoot.walkAtRules((atRule) => {
    mediaQueryRules.push(atRule);
  });

  return {
    inlineStyles,
    tailwindClassNames,
    mediaQueryRules,
  };
};
