import { type CssNode, generate, walk } from 'css-tree';
import { convertCssPropertyToReactProperty } from '../compatibility/convert-css-property-to-react-property';

export function makeInlineStylesFor(inlinableRules: CssNode[]) {
  const styles: Record<string, string> = {};

  for (const rule of inlinableRules) {
    walk(rule, {
      visit: 'Declaration',
      enter(declaration) {
        styles[convertCssPropertyToReactProperty(declaration.property)] =
          generate(declaration.value) +
          (declaration.important ? '!important' : '');
      },
    });
  }

  return styles;
}
