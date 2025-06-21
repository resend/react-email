export const borderParser = (border: string) => {
  const [borderWidth, borderStyle, ...borderColor] = border.split(' ');
  return {
    borderWidth: Number.parseInt(borderWidth),
    borderStyle,
    borderColor: borderColor.join(' '),
  };
}; 