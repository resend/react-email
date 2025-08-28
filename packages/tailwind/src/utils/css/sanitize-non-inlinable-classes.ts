import { AtRule, type Root, Rule } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { sanitizeClassName } from '../compatibility/sanitize-class-name';

/**
 * This function goes through a few steps to ensure the best email client support and
 * to ensure that the media queries and pseudo classes are going to applied correctly alongisde
 * the inline styles.
 *
 * What it does is:
 * 1. Converts all declarations in all rules into being important ones
 * 2. Sanitizes all the selectors of all non-inlinable rules
 * 4. Merges at rules that have equivalent parameters
 */
export const sanitizeNonInlinableClasses = (root: Root) => {
  const sanitizedRules: (Rule | AtRule)[] = [];
  const nonInlinableClasses: string[] = [];

  const selectorProcessor = selectorParser();

  root.walkRules((rule) => {
    const selectorRoot = selectorProcessor.astSync(rule.selector);

    let hasAtRuleInside = false;
    rule.walkAtRules(() => {
      hasAtRuleInside = true;
    });

    let hasPseudoSelector = false as boolean;
    selectorRoot.walkPseudos(() => {
      hasPseudoSelector = true;
    });

    const isInlinable = !hasAtRuleInside && !hasPseudoSelector;

    if (isInlinable) {
      selectorRoot.walkClasses((className) => {
        nonInlinableClasses.push(className.value);
        sanitizeSelectorClassName(className);
      });

      const processedRule = rule.clone({ selector: selectorRoot.toString() });
      processedRule.walkDecls((decl) => {
        decl.important = true;
      });

      sanitizedRules.push(processedRule);
    }
  });

  return {
    nonInlinableClasses,
    sanitizedRules,
  };
};

const sanitizeSelectorClassName = (className: selectorParser.ClassName) => {
  className.replaceWith(
    className.clone({
      value: sanitizeClassName(className.value),
    }),
  );
};
