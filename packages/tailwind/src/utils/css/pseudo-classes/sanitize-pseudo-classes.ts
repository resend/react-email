import type { Root, Rule, AtRule } from "postcss";
import { processSelector } from "../process-selector";

interface PseudoClassResult {
  pseudoClassClasses: string[];
  sanitizedPseudoClassRules: (Rule | AtRule)[];
}

/**
 * This function processes pseudo-class selectors (like :hover) for email compatibility.
 *
 * What it does:
 * 1. Extracts only rules that have pseudo selectors
 * 2. Sanitizes the class names while preserving pseudo-classes
 * 3. Maintains separate rules for different class names
 * 4. Preserves media queries and other at-rules
 */
export const sanitizePseudoClasses = (root: Root): PseudoClassResult => {
  const sanitizedPseudoClassRules: (Rule | AtRule)[] = [];
  const pseudoClassClasses: string[] = [];

  const processRule = (rule: Rule): Rule | null => {
    const { processedSelector, hasPseudoSelector } = processSelector(
      rule,
      true,
      pseudoClassClasses,
    );

    if (hasPseudoSelector) {
      const newRule = rule.clone();
      newRule.selector = processedSelector;

      newRule.walkDecls((declaration) => {
        declaration.important = true;
      });

      return newRule;
    }

    return null;
  };

  // Process rules within at-rules (like media queries)
  root.walkAtRules((atRule) => {
    const pseudoRules: Rule[] = [];

    atRule.walkRules((rule) => {
      const processedRule = processRule(rule);
      if (processedRule) {
        pseudoRules.push(processedRule);
      }
    });

    if (pseudoRules.length > 0) {
      const newAtRule = atRule.clone({ nodes: [] });
      newAtRule.nodes = pseudoRules;
      sanitizedPseudoClassRules.push(newAtRule);
    }
  });

  // Process top-level rules
  root.walkRules((rule) => {
    if (!rule.parent?.type || rule.parent.type === "root") {
      const processedRule = processRule(rule);
      if (processedRule) {
        sanitizedPseudoClassRules.push(processedRule);
      }
    }
  });

  return {
    pseudoClassClasses,
    sanitizedPseudoClassRules,
  };
};
