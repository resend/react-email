import selectorParser from "postcss-selector-parser";
import type { Rule } from "postcss";
import { sanitizeClassName } from "../compatibility/sanitize-class-name";

/**
 * Helper function to process selectors and sanitize class names.
 * @param rule - The CSS rule to process.
 * @param withPseudo - Whether to process selectors with pseudo-classes.
 * @param outputClasses - Array to store class names after processing.
 * @returns An object containing the processed selector and whether it has a pseudo selector.
 */
export const processSelector = (
  rule: Rule,
  withPseudo: boolean,
  outputClasses: string[],
) => {
  let hasPseudoSelector = false as boolean;

  const processedSelector = selectorParser((selectorRoot) => {
    selectorRoot.walkPseudos(() => {
      hasPseudoSelector = true;
    });

    if (
      (withPseudo && hasPseudoSelector) ||
      (!withPseudo && !hasPseudoSelector)
    ) {
      selectorRoot.walkClasses((singleClass) => {
        outputClasses.push(singleClass.value);

        singleClass.replaceWith(
          selectorParser.className({
            ...singleClass,
            value: sanitizeClassName(singleClass.value),
          }),
        );
      });
    }
  }).processSync(rule.selector);

  return {
    processedSelector,
    hasPseudoSelector,
  };
};
