export const getCssUnit = (title: string) => {
  return title.endsWith(' unit') ? title.replace(' unit', '') : undefined;
};
