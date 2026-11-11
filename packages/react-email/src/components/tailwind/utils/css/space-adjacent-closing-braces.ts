/**
 * Outlook.com drops everything in a <style> element after two adjacent
 * closing braces (`}}`). Separating them with a space works around it.
 * See: https://github.com/hteumeuleu/email-bugs#92
 */
export function spaceAdjacentClosingBraces(css: string): string {
  return css.replace(/}}/g, '} }');
}
