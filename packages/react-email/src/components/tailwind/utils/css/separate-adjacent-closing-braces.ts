import type { GenerateHandlers } from 'css-tree';

// @types/css-tree is still on v2 and doesn't declare the v3 `emit` handler
type HandlersWithEmit = GenerateHandlers & {
  emit: (value: string, type: number, auto: boolean) => void;
};

/**
 * A css-tree `generate` decorator that writes `} }` instead of `}}`.
 *
 * Outlook.com drops everything in a <style> after two adjacent closing braces,
 * see https://github.com/hteumeuleu/email-bugs/issues/92. Working on tokens
 * instead of the generated string keeps braces inside strings and url() as is.
 */
export function separateAdjacentClosingBraces(
  handlers: GenerateHandlers,
): GenerateHandlers {
  const { emit } = handlers as HandlersWithEmit;
  let previousValue = '';
  const decorated: HandlersWithEmit = {
    ...(handlers as HandlersWithEmit),
    emit(value, type, auto) {
      if (value === '}' && previousValue === '}') {
        emit(' ', type, true);
      }
      emit(value, type, auto);
      previousValue = value;
    },
  };
  return decorated;
}
