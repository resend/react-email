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
  const classesWithNonInlinableStyles = new Set<string>();

  tailwindStylesRoot.walkRules((rule) => {
    const isInAtRule = rule.parent?.type === 'atrule';

    let hasPseudoSelectors = false;
    selectorParser((selector) => {
      selector.walkPseudos(() => {
        hasPseudoSelectors = true;
      });
    }).processSync(rule.selector);

    const isNonInlinable = isInAtRule || hasPseudoSelectors;

    if (isNonInlinable) {
      selectorParser((selector) => {
        selector.walkClasses((v) => {
          classesWithNonInlinableStyles.add(unescapeClass(v.value));
        });
      }).processSync(rule.selector);
    }
  });

  const inlinableClasses = new Set<string>();

  walkInlinableRules(tailwindStylesRoot, (rule) => {
    selectorParser((selector) => {
      selector.walkClasses((v) => {
        inlinableClasses.add(unescapeClass(v.value));
      });
    }).processSync(rule.selector);

    rule.walkDecls((declaration) => {
      styles[convertCssPropertyToReactProperty(declaration.prop)] =
        declaration.value + (declaration.important ? '!important' : '');
    });
  });

  residualClasses = residualClasses.filter((singleClass) => {
    const isInlinable = inlinableClasses.has(singleClass);
    const hasNonInlinableStyles =
      classesWithNonInlinableStyles.has(singleClass);

    return !isInlinable || hasNonInlinableStyles;
  });

  return {
    styles,
    residualClassName: residualClasses.join(' '),
  };
}
