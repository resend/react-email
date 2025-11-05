/**
 * Centralized fallback for Node versions (<20.12.0) without util.styleText.
 * Returns the original text when styleText is unavailable.
 */
import * as nodeUtil from 'node:util';

type StyleTextFunction = typeof nodeUtil.styleText;

export const styleText: StyleTextFunction = (nodeUtil as any).styleText
  ? (nodeUtil as any).styleText
  : (_: string, text: string) => text;
