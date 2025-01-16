import type { AtRule, Root } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { sanitizeClassName } from '../../compatibility/sanitize-class-name';

/**
 * This function goes through a few steps to ensure the best email client support and
 * to ensure that the media queries are going to applied correctly alongisde
 * the inline styles.
 *
 * What it does is:
 * 1. Ignore all the rules that have any pseudo selectors
 * 2. Converts all declarations in all rules into being important ones
 * 3. Sanitizes all the selectors of all rules in the media queries
 * 4. Merges at rules that have equivalent parameters
 */
export const sanitizeMediaQueries = (root: Root) => {
  const sanitizedAtRules: AtRule[] = [];
  const mediaQueryClasses: string[] = [];

  root.walkAtRules((atRule) => {
    const sanitizedAtRule = atRule.clone();

    sanitizedAtRule.walkRules((rule) => {
      let hasPseudoSelector = false as boolean;
      rule.selector = selectorParser((selectorRoot) => {
        selectorRoot.walkPseudos(() => {
          hasPseudoSelector = true;
        });
        if (!hasPseudoSelector) {
          selectorRoot.walkClasses((singleClass) => {
            mediaQueryClasses.push(singleClass.value);
            singleClass.replaceWith(
              selectorParser.className({
                ...singleClass,
                value: sanitizeClassName(singleClass.value),
              }),
            );
          });
        }
      }).processSync(rule.selector);

      if (!hasPseudoSelector) {
        rule.walkDecls((declaration) => {
          declaration.important = true;
        });
      } else {
        sanitizedAtRule.removeChild(rule);
      }
    });
    const equivalentRule = sanitizedAtRules.find(
      (r) => r.params === sanitizedAtRule.params,
    );
    if (equivalentRule) {
      equivalentRule.append(sanitizedAtRule.nodes);
    } else {
      sanitizedAtRules.push(sanitizedAtRule);
    }
  });

  return {
    mediaQueryClasses,
    sanitizedAtRules,
  };
};
