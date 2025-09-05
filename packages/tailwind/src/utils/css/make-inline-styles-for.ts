import { type CssNode, generate, walk } from 'css-tree';
import { convertCssPropertyToReactProperty } from '../compatibility/convert-css-property-to-react-property';
import { unescapeClass } from '../compatibility/unescape-class';
import { isRuleInlinable } from './is-rule-inlinable';

export function makeInlineStylesFor(
  className: string,
  tailwindStyles: CssNode,
) {
  const classes = className.split(' ');

  let residualClasses = [...classes];
  const styles: Record<string, string> = {};

  walk(tailwindStyles, {
    visit: 'Rule',
    enter(rule) {
      if (isRuleInlinable(rule)) {
        const classesOnSelector: string[] = [];
        walk(rule.prelude, {
          visit: 'ClassSelector',
          enter(classNode) {
            classesOnSelector.push(unescapeClass(classNode.name));
          },
        });

        residualClasses = residualClasses.filter((singleClass) => {
          return !classesOnSelector.includes(singleClass);
        });

        walk(rule, {
          visit: 'Declaration',
          enter(declaration) {
            styles[convertCssPropertyToReactProperty(declaration.property)] =
              generate(declaration.value) +
              (declaration.important ? '!important' : '');
          },
        });
      }
    },
  });

  return {
    styles,
    residualClassName: residualClasses.join(' '),
  };
}
