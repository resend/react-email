export const getElementNames = (title: string, keywords: string | null) => {
  const match = /<(?<elementName>[^>]*)> element/.exec(title);
  if (match) {
    const [_full, elementName] = match;

    if (elementName) {
      return [elementName.toLowerCase()];
    }
  }

  if (keywords !== null && keywords.length > 0) {
    return keywords
      .toLowerCase()
      .split(/\s*,\s*/)
      .map((piece) => piece.trim());
  }

  if (title.split(',').length > 1) {
    return title
      .toLowerCase()
      .split(/\s*,\s*/)
      .map((piece) => piece.trim());
  }

  return [];
};
