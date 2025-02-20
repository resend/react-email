import { AtRule, type Root, type Rule } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { sanitizeClassName } from '../../compatibility/sanitize-class-name';

/**
 * This function goes through a few steps to ensure the best email client support and
 * to ensure that the media queries and pseudo classes are going to applied correctly alongisde
 * the inline styles.
 *
 * What it does is:
 * 1. Converts all declarations in all rules into being important ones
 * 2. Sanitizes all the selectors of all rules in the media queries
 * 3. Sanitizes all the selectors of all rules using pseudo classes
 * 4. Merges at rules that have equivalent parameters
 */
export const sanitizeNonInlinableClasses = (root: Root) => {
  const sanitizedRules: (Rule | AtRule)[] = [];
  const nonInlinableClasses: string[] = [];

  // Process rules within at-rules (like media queries)
  root.walkAtRules((atRule) => {
    const sanitizedAtRule = atRule.clone();
    const processedRules: Rule[] = [];

    sanitizedAtRule.walkRules((rule) => {
      const processedSelector = selectorParser((selectorRoot) => {
        sanitizeClasses(selectorRoot, nonInlinableClasses);
      }).processSync(rule.selector);

      const processedRule = rule.clone({ selector: processedSelector });
      processedRule.walkDecls((decl) => {
        decl.important = true;
      });

      processedRules.push(processedRule);
      sanitizedAtRule.removeChild(rule);
    });

    sanitizedAtRule.append(...processedRules);

    const equivalentRule = sanitizedRules.find(
      (r) => r instanceof AtRule && r.params === sanitizedAtRule.params,
    );

    if (equivalentRule) {
      equivalentRule.append(sanitizedAtRule.nodes);
    } else {
      sanitizedRules.push(sanitizedAtRule);
    }
  });

  // Process top-level rules
  root.walkRules((rule) => {
    if (rule.parent && rule.parent.type !== 'root') return;

    let hasPseudoSelector = false as boolean;

    const processedSelector = selectorParser((selectorRoot) => {
      selectorRoot.walkPseudos(() => {
        hasPseudoSelector = true;
      });

      if (!hasPseudoSelector) return;

      sanitizeClasses(selectorRoot, nonInlinableClasses);
    }).processSync(rule.selector);

    if (hasPseudoSelector) {
      const processedRule = rule.clone({ selector: processedSelector });
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

const sanitizeClasses = (selectorRoot: selectorParser.Root, outputClasses: string[]) => {
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
