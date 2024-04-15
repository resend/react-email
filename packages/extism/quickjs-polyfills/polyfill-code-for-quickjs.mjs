import { transformAsync } from "@babel/core";

import { avoidReservedKeywordsOnMethodNames } from "./avoid-reserved-keywords-on-method-names.mjs";
// import { useProperIsArraySyntax } from "./use-proper-is-array-syntax.mjs";

/**
 * @param {string} code
 */
export async function polyfillCodeForQuickJS(code) {
  const result = await transformAsync(code, {
    plugins: [avoidReservedKeywordsOnMethodNames/* , useProperIsArraySyntax */],
    minified: false
  });

  return result.code;
}
