import type { StyleSheet } from 'css-tree';
import { resolveAllCssVariables } from './utils/css/resolve-all-css-variables';
import { resolveCalcExpressions } from './utils/css/resolve-calc-expressions';
import { sanitizeDeclarations } from './utils/css/sanitize-declarations';

export function sanitizeStyleSheet(styleSheet: StyleSheet) {
  resolveAllCssVariables(styleSheet);
  resolveCalcExpressions(styleSheet);
  sanitizeDeclarations(styleSheet);
}
