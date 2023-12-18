// @ts-check

/**
  * @param text {string}
  */
export const camelize = (text) => {
  return text.replace(/-(?<lowerCaseLetter>[a-z])/g, (match) => {
    return match[1].toUpperCase();
  });
};
