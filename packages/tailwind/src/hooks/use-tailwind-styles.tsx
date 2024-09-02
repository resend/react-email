import React from "react";
import type { TailwindConfig } from "../tailwind";
import { separateMediaQueriesFromCSS } from "../utils/css/media-queries/separate-media-queries-from-css";
import { rulesFor } from "../utils/css/rules-for";
import { quickSafeRenderToString } from "../utils/quick-safe-render-to-string";
import { getCssForMarkup } from "../utils/tailwindcss/get-css-for-markup";
import { useRgbNonSpacedSyntax } from "../utils/compatibility/use-rgb-non-spaced-syntax";
import { cssToJsxStyle } from "../utils/compatibility/css-to-jsx-style";
import { unescapeClass } from "../utils/compatibility/unescape-class";
import { sanitizeRuleSelector } from "../utils/compatibility/sanitize-rule-selector";
import { makeAllRulePropertiesImportant } from "../utils/compatibility/make-all-rule-properties-important";
import { useSuspensedPromise } from "./use-suspensed-promise";

/**
 * Gets all the necessary information from the node and the Tailwind config to be able
 * to apply all the Tailwind styles.
 */
export function useTailwindStyles(
  node: React.ReactNode,
  config: TailwindConfig,
) {
  const markup = quickSafeRenderToString(<>{node}</>);
  const css = useRgbNonSpacedSyntax(
    useSuspensedPromise(() => getCssForMarkup(markup, config), markup),
  );

  const [cssWithoutMediaQueries, mediaQueries] =
    separateMediaQueriesFromCSS(css);

  const stylePerClassMap: Record<string, React.CSSProperties> = {};
  for (const rule of rulesFor(cssWithoutMediaQueries)) {
    const unescapedClass = unescapeClass(rule.selector);
    stylePerClassMap[unescapedClass] = cssToJsxStyle(rule.content);
  }

  const nonInlinableClasses: string[] = [];

  const sanitizedMediaQueries = mediaQueries.map((mediaQuery) => {
    let sanitizedMediaQuery = mediaQuery;
    for (const rule of rulesFor(mediaQuery)) {
      nonInlinableClasses.push(unescapeClass(rule.selector));

      sanitizedMediaQuery = sanitizedMediaQuery.replace(
        rule.value,
        rule.value
          .replace(rule.selector, sanitizeRuleSelector(rule.selector))
          .replace(rule.content, makeAllRulePropertiesImportant(rule.content))
          .trim(),
      );
    }
    return sanitizedMediaQuery
      .replace(/(\r\n|\r|\n)+/gm, "")
      .replace(/\s+/gm, " ");
  });

  return {
    stylePerClassMap,
    sanitizedMediaQueries,
    nonInlinableClasses,
  };
}
