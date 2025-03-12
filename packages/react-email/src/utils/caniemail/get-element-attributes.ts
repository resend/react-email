export function getElementAttributes(title: string) {
  if (title.endsWith(' attribute')) {
    return [title.replace(' attribute', '')];
  }

  return [];
}
