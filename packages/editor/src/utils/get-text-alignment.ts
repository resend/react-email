export function getTextAlignment(alignment: string | undefined) {
  switch (alignment) {
    case 'left':
      return { textAlign: 'left' } as const;
    case 'center':
      return { textAlign: 'center' } as const;
    case 'right':
      return { textAlign: 'right' } as const;
    default:
      return {};
  }
}
