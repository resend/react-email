import type { Element } from 'stylis';
import { traverse } from './traverse';

export function isRuleInlinable(rule: Element): boolean {
  let hasAtRuleInside = false;
  let hasPseudoSelector = false;
  for (const element of traverse(rule)) {
    console.log(element);
    if (typeof element === 'object') {
      if (element.type.startsWith('@media')) {
        hasAtRuleInside = true;
      }
      if (element.type === 'rule') {
        const selectorList = Array.isArray(element.props)
          ? element.props
          : [element.props];
        if (selectorList.some((selector) => selector.includes(':'))) {
          hasPseudoSelector = true;
        }
      }
    }
  }

  return !hasAtRuleInside && !hasPseudoSelector;
}
