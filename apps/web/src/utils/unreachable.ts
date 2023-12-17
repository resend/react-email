export const unreachable = (
  condition: never,
  message = `Entered unreachable code. Received '${
    typeof condition === "string" ? condition : JSON.stringify(condition)
  }'.`,
): never => {
  throw new TypeError(message);
};
