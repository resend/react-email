export const unreachable = (
  condition: string | Record<string, unknown>,
  message = `Entered unreachable code. Received '${
    typeof condition === 'string' ? condition : JSON.stringify(condition)
  }'.`,
): never => {
  throw new TypeError(message);
};
