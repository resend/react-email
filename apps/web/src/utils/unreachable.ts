export const unreachable = (
  condition: never,
  message = `Entered unreachable code. Received '${condition}'.`,
): never => {
  throw new TypeError(message);
};
