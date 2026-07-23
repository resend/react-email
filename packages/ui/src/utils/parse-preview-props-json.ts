import { err, ok, type Result } from './result';

/**
 * Parses a props-panel JSON draft into a props object, rejecting JSON that is
 * valid but not usable as React props (arrays, primitives, `null`). The error
 * is the human-readable message shown next to the editor.
 */
export const parsePreviewPropsJson = (
  text: string,
): Result<Record<string, unknown>, string> => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (exception) {
    return err((exception as Error).message);
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return err('Props must be a JSON object');
  }

  return ok(parsed as Record<string, unknown>);
};
