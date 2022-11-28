export const unreachable = (condition, message = `Entered unreachable code. Received '${condition}'.`) => {
    throw new TypeError(message);
};
