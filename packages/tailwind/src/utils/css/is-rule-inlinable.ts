import type { Rule } from 'postcss';
import selectorParser from 'postcss-selector-parser';

const selectorProcessor = selectorParser();

export function parseSelectors(rule: Rule): selectorParser.Root {
  return selectorProcessor.astSync(rule.selector);
}

export function isRuleInlinable(rule: Rule): boolean {
  const selectorRoot = parseSelectors(rule);

  let hasAtRuleInside = false;
  rule.walkAtRules(() => {
    hasAtRuleInside = true;
  });

  let hasPseudoSelector = false as boolean;
  selectorRoot.walkPseudos(() => {
    hasPseudoSelector = true;
  });

  return !hasAtRuleInside && !hasPseudoSelector;
}
