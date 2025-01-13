import selectorParser from "postcss-selector-parser";
import type { Root, Rule } from "postcss";
import { sanitizeClassName } from "../../compatibility/sanitize-class-name";

interface PseudoClassResult {
  pseudoClassClasses: string[];
  sanitizedPseudoClassRules: Rule[];
}

/**
 * This function processes pseudo-class selectors (like :hover) for email compatibility.
 *
 * What it does:
 * 1. Extracts only rules that have pseudo selectors
 * 2. Sanitizes the class names while preserving pseudo-classes
 * 3. Maintains separate rules for different class names
 */
export const sanitizePseudoClasses = (root: Root): PseudoClassResult => {
  const sanitizedPseudoClassRules: Rule[] = [];
  const pseudoClassClasses: string[] = [];

  root.walkRules((rule) => {
    let hasPseudoSelector = false as boolean;

    // Parse the selector to check for pseudo-classes
    const processedSelector = selectorParser((selectorRoot) => {
      selectorRoot.walkPseudos(() => {
        hasPseudoSelector = true;
      });

      if (hasPseudoSelector) {
        // Store the original class name before sanitization
        selectorRoot.walkClasses((singleClass) => {
          const originalClass = singleClass.value;
          if (!pseudoClassClasses.includes(originalClass)) {
            pseudoClassClasses.push(originalClass);
          }

          // Sanitize the class name
          singleClass.replaceWith(
            selectorParser.className({
              ...singleClass,
              value: sanitizeClassName(singleClass.value),
            }),
          );
        });
      }
    }).processSync(rule.selector);

    if (hasPseudoSelector) {
      const newRule = rule.clone();
      newRule.selector = processedSelector;

      // Make all declarations !important
      newRule.walkDecls((declaration) => {
        declaration.important = true;
      });

      sanitizedPseudoClassRules.push(newRule);
    }
  });

  return {
    pseudoClassClasses,
    sanitizedPseudoClassRules,
  };
};
