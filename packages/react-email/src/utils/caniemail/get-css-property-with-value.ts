const propertyRegex =
  /(?<propertyName>[a-z-]+)\s*:\s*(?<propertyValue>[a-zA-Z\-0-9()+*/_ ]+)/;

export const getCssPropertyWithValue = (title: string) => {
  const match = propertyRegex.exec(title.trim());
  if (match) {
    const [_full, propertyName, propertyValue] = match;
    return {
      name: propertyName!,
      value: propertyValue!,
    };
  }
  return undefined;
};
