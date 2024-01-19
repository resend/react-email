/* eslint-disable no-console */

let silencingKeyWarnings = undefined as boolean | undefined;
export const silenceKeyWarnings = () => {
  if (
    process.env.NODE_ENV !== "production" &&
    typeof silencingKeyWarnings !== "undefined"
  ) {
    silencingKeyWarnings = true;
    console.error = (() => {
      const originalError = console.error;
      return (...args: string[]) => {
        if (silencingKeyWarnings) {
          const line = args[0];
          if (
            line.startsWith(
              'Warning: Each child in an array or iterator should have a unique "key" prop',
            )
          ) {
            console.log(line);
            // Ignore key warnings
          } else {
            originalError(...args);
          }
        } else {
          originalError(...args);
        }
      };
    })();
  }
};

export const unsilenceKeyWarnings = () => {
  if (typeof silencingKeyWarnings !== 'undefined') {
    silencingKeyWarnings = false;
  }
};
