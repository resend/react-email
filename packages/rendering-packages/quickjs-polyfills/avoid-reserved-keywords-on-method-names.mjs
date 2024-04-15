const reservedKeywords = [
  "static"
];

/**
  * @param {string} keyword
  */
function isReservedKeyword(keyword) {
  return reservedKeywords.includes(keyword);
}

/**
  * @param {string} input
  */
export function avoidReservedKeywordsOnMethodNames() {
  return {
    visitor: {
      /**
        * @param {import('@babel/core').NodePath<import('@babel/core').types.Identifier>} path
        */
      Identifier(path) {
        if (isReservedKeyword(path.node.name)) {
          // Prefix reserved keywords with '_'
          path.node.name = `_${path.node.name}`;
        }
      },
      /**
        * @param {import('@babel/core').NodePath<import('@babel/core').types.CallExpression>} path
        */
      CallExpression(path) {
        if (
          path.node.callee.type === "Identifier" &&
          isReservedKeyword(path.node.callee.name)
        ) {
          // Rename method calls
          path.node.callee.name = `_${path.node.callee.name}`;
        }
      },
    },
  };
}

