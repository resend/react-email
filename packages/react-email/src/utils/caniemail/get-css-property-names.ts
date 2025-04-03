import { allCssProperties } from './all-css-properties';

export const getCssPropertyNames = (title: string, keywords: string | null) => {
  if (allCssProperties.includes(title.replace(' property', '')))
    return [title.replace(' property', '')];

  if (title.split('&').length > 1) {
    return title
      .split(/\s*&\s*/)
      .map((piece) => piece.trim())
      .filter((possiblePropertyName) =>
        allCssProperties.includes(possiblePropertyName),
      );
  }

  if (title.split(',').length > 1) {
    return title
      .split(/\s*,\s*/)
      .map((piece) => piece.trim())
      .filter((possiblePropertyName) =>
        allCssProperties.includes(possiblePropertyName),
      );
  }

  if (keywords) {
    return keywords
      .split(/\s*,\s*/)
      .filter((keyword) => allCssProperties.includes(keyword));
  }

  return [];
};
