import { types as t } from '@babel/core';

/**
  * @param {string} input
  */
export function useProperIsArraySyntax() {
  return {
    /** @type {import('@babel/core').Visitor} */
    visitor: {
      BinaryExpression(path) {
        if (path.node.left.type === 'StringLiteral' && path.node.left.value === 'length') {
          path.replaceWith(
            t.callExpression(
              t.memberExpression(
                t.identifier('Array'),
                t.identifier('isArray'),
              ),
              [path.node.right]
            )
          )
        }
      }
    },
  };
}

