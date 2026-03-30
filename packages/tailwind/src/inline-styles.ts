import type { StyleSheet } from 'css-tree';
import { extractRulesPerClass } from './utils/css/extract-rules-per-class';
import { getCustomProperties } from './utils/css/get-custom-properties';
import { makeInlineStylesFor } from './utils/css/make-inline-styles-for';

export function inlineStyles(
  styleSheet: StyleSheet,
  classes: string[],
): Record<string, string> {
  const { inlinable: inlinableRules } = extractRulesPerClass(
    styleSheet,
    classes,
  );

  const customProperties = getCustomProperties(styleSheet);

  return makeInlineStylesFor(
    Array.from(inlinableRules.values()),
    customProperties,
  );
}
