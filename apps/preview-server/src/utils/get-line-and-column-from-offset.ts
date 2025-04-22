export const getLineAndColumnFromOffset = (
  offset: number,
  content: string,
): [line: number, column: number] => {
  const lineBreaks = [...content.slice(0, offset).matchAll(/\n|\r|\r\n/g)];

  const line = lineBreaks.length + 1;
  const column = offset - (lineBreaks[lineBreaks.length - 1]?.index ?? 0);

  return [line, column];
};
