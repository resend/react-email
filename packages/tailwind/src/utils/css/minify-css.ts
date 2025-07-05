import type { Root } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';

function minifyValue(value: string) {
  const parsed = valueParser(value.trim());
  parsed.walk((node) => {
    if ('before' in node) node.before = '';
    if ('after' in node) node.after = '';
    if (node.type === 'space') node.value = ' ';
  });
  return parsed.toString();
}

export const minifyCss = (root: Root): string => {
  const toMinify = root.clone();
  toMinify.walk((node) => {
    if (node.type === 'comment') {
      if (node.text[0] === '!') {
        node.raws.before = '';
        node.raws.after = '';
      } else {
        node.remove();
      }
    } else if (node.type === 'atrule') {
      node.raws = {
        before: '',
        after: '',
        afterName: ' ',
      };
      node.params = minifyValue(node.params);
    } else if (node.type === 'decl') {
      node.raws = {
        before: '',
        between: ':',
        important: node.important
          ? (node.raws.important?.replaceAll(' ', '') ?? '!important')
          : undefined,
      };
      node.value = minifyValue(node.value);
    } else if (node.type === 'rule') {
      node.raws = { before: '', between: '', after: '', semicolon: false };
      node.selector = selectorParser((selectorRoot) => {
        selectorRoot.walk((selector) => {
          selector.spaces = { before: '', after: '' };

          if ('raws' in selector && selector.raws?.spaces) {
            selector.raws.spaces = {};
          }
        });
      })
        .processSync(node.selector)
        .toString();
    }
  });
  return toMinify.toString();
};
