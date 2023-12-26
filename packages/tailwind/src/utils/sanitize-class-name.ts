/**
 * Replaces special characters to avoid problems on email clients.
 *
 * @param className - This should not come with any escaped charcters, it should come the same
 * as is on the `className` attribute on React elements.
 */
export const sanitizeClassName = (className: string) => {
  return className
    .replaceAll("+", "plus")
    .replaceAll("[", "")
    .replaceAll("%", "pc")
    .replaceAll("]", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("!", "imprtnt")
    .replaceAll(">", "gt")
    .replaceAll("<", "lt")
    .replaceAll("=", "eq")
    .replace(
      /[^a-zA-Z0-9\-_]/g,
      "_",
    );
};
