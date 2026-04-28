import type { StyleSheet } from 'css-tree';
import { resolveAllCssVariables } from './utils/css/resolve-all-css-variables.js';
import { resolveCalcExpressions } from './utils/css/resolve-calc-expressions.js';
import { sanitizeDeclarations } from './utils/css/sanitize-declarations.js';

export function sanitizeStyleSheet(styleSheet: StyleSheet) {
  resolveAllCssVariables(styleSheet);
  resolveCalcExpressions(styleSheet);
  sanitizeDeclarations(styleSheet);
}
