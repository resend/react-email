// @ts-check

export const camelize = (text) => {
  return text.replace(/-([a-z])/g, (match) => {
    return match[1].toUpperCase();
  });
};
