export const getCssUnitsFromSupportEntry = (title: string) => {
  return title.endsWith(" unit") ? title.replace(" unit", "") : undefined;
};
