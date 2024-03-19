export const fromDashCaseToCamelCase = (text: string) => {
  return text.replace(/-(\w|$)/g, (_, p1: string) => p1.toUpperCase());
};
