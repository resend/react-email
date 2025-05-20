/**
 * Sanitizes text by replacing underscores and hyphens with spaces
 */
export const sanitize = (text: string): string => {
  return text.replace(/[_-]/g, ' ');
};
