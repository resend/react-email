export function getTextAlignment(alignment: string | undefined) {
  switch (alignment) {
    case 'left':
      return { textAlign: 'left' };
    case 'center':
      return { textAlign: 'center' };
    case 'right':
      return { textAlign: 'right' };
    default:
      return {};
  }
}
