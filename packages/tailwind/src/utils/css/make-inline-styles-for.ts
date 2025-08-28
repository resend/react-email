import type { Root } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { convertCssPropertyToReactProperty } from '../compatibility/convert-css-property-to-react-property';
import { unescapeClass } from '../compatibility/unescape-class';
import { isRuleInlinable } from './is-rule-inlinable';

export function makeInlineStylesFor(
  className: string,
  tailwindStylesRoot: Root,
) {
  const classes = className.split(' ');

  let residualClasses = [...classes];
  const styles: Record<string, string> = {};

  tailwindStylesRoot.walkRules((rule) => {
    if (isRuleInlinable(rule)) {
      const classesOnSelector: string[] = [];
      selectorParser((selector) => {
        selector.walkClasses((v) => {
          classesOnSelector.push(unescapeClass(v.value));
        });
      }).processSync(rule.selector);

      residualClasses = residualClasses.filter((singleClass) => {
        return !classesOnSelector.includes(singleClass);
      });

      rule.walkDecls((declaration) => {
        styles[convertCssPropertyToReactProperty(declaration.prop)] =
          declaration.value + (declaration.important ? '!important' : '');
      });
    }
  });

  return {
    styles,
    residualClassName: residualClasses.join(' '),
  };
}
