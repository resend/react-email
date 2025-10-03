import { type CssNode, walk } from 'css-tree';

/**
 * Intentionally only resolves `*` and `/` operations without dealing with parenthesis, because this is the only thing required to run Tailwind v4
 */
export function resolveCalcExpressions(node: CssNode) {
  walk(node, {
    visit: 'Function',
    enter(func, funcListItem) {
      if (func.name === 'calc') {
        /*
          [
            { type: 'Dimension', loc: null, value: '0.25', unit: 'rem' },
            { type: 'Operator', loc: null, value: '*' },
            { type: 'Number', loc: null, value: '2' }
            { type: 'Percentage', loc: null, value: '2' }
          ]
        */
        func.children.forEach((child, item) => {
          const left = item.prev;
          const right = item.next;
          if (
            left &&
            right &&
            child.type === 'Operator' &&
            (left.data.type === 'Dimension' ||
              left.data.type === 'Number' ||
              left.data.type === 'Percentage') &&
            (right.data.type === 'Dimension' ||
              right.data.type === 'Number' ||
              right.data.type === 'Percentage')
          ) {
            if (child.value === '*' || child.value === '/') {
              const value = (() => {
                if (child.value === '*') {
                  return String(
                    Number.parseFloat(left.data.value) *
                    Number.parseFloat(right.data.value),
                  );
                }
                if (right.data.value === '0') {
                  return '0';
                }
                return String(
                  Number.parseFloat(left.data.value) /
                  Number.parseFloat(right.data.value),
                );
              })();
              if (
                left.data.type === 'Dimension' &&
                right.data.type === 'Number'
              ) {
                item.data = {
                  type: 'Dimension',
                  unit: left.data.unit,
                  value,
                };
                func.children.remove(left);
                func.children.remove(right);
              } else if (
                left.data.type === 'Number' &&
                right.data.type === 'Dimension'
              ) {
                item.data = {
                  type: 'Dimension',
                  unit: right.data.unit,
                  value,
                };
                func.children.remove(left);
                func.children.remove(right);
              } else if (
                left.data.type === 'Number' &&
                right.data.type === 'Number'
              ) {
                item.data = {
                  type: 'Number',
                  value,
                };
                func.children.remove(left);
                func.children.remove(right);
              } else if (
                left.data.type === 'Dimension' &&
                right.data.type === 'Dimension' &&
                left.data.unit === right.data.unit
              ) {
                if (child.value === '/') {
                  item.data = {
                    type: 'Number',
                    value,
                  };
                } else {
                  item.data = {
                    type: 'Dimension',
                    unit: left.data.unit,
                    value,
                  };
                }
                func.children.remove(left);
                func.children.remove(right);
              } else if (
                left.data.type === 'Percentage' &&
                right.data.type === 'Number'
              ) {
                item.data = {
                  type: 'Percentage',
                  value,
                };
                func.children.remove(left);
                func.children.remove(right);
              } else if (
                left.data.type === 'Number' &&
                right.data.type === 'Percentage'
              ) {
                item.data = {
                  type: 'Percentage',
                  value,
                };
                func.children.remove(left);
                func.children.remove(right);
              } else if (
                left.data.type === 'Percentage' &&
                right.data.type === 'Percentage'
              ) {
                if (child.value === '/') {
                  item.data = {
                    type: 'Number',
                    value,
                  };
                } else {
                  item.data = {
                    type: 'Percentage',
                    value,
                  };
                }
                func.children.remove(left);
                func.children.remove(right);
              }
            }
          }
        });
        if (func.children.size === 1 && func.children.first) {
          funcListItem.data = func.children.first;
        }
      }
    },
  });
}
