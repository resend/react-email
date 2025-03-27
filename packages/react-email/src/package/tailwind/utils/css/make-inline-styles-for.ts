import type { Root, Rule } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { convertCssPropertyToReactProperty } from '../compatibility/convert-css-property-to-react-property';
import { unescapeClass } from '../compatibility/unescape-class';

const walkInlinableRules = (root: Root, callback: (rule: Rule) => void) => {
  root.walkRules((rule) => {
    if (rule.parent?.type === 'atrule') {
      return;
    }

    selectorParser((selector) => {
      let hasPseudoSelectors = false as boolean;
      selector.walkPseudos(() => {
        hasPseudoSelectors = true;
      });

      if (!hasPseudoSelectors) {
        callback(rule);
      }
    }).processSync(rule.selector);
  });
};

export function makeInlineStylesFor(
  className: string,
  tailwindStylesRoot: Root,
) {
  const classes = className.split(' ');

  let residualClasses = [...classes];
  const styles: Record<string, string> = {};

  walkInlinableRules(tailwindStylesRoot, (rule) => {
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
  });

  return {
    styles,
    residualClassName: residualClasses.join(' '),
  };
}
