const splitByLines = (text: string) => {
  const properSplit: string[] = [];
  const unevenSplit = text.split(/(?<eol>\n|\r|\r\n)/);

  for (const [i, segment] of unevenSplit.entries()) {
    if (i % 2 === 0) {
      let segmentToInsert = segment;
      if (i + 1 < unevenSplit.length) {
        segmentToInsert += unevenSplit[i + 1];
      }
      properSplit.push(segmentToInsert);
    }
  }

  return properSplit;
};

export const getLineAndColumnFromIndex = (
  code: string,
  index: number,
): [line: number, column: number] => {
  const lines = splitByLines(code);

  let lineNumber = 1;
  const line = () => {
    const l = lines[lineNumber - 1];
    if (l === undefined)
      throw new Error(
        'Could not find the line for a specific index in the code',
        { cause: { lines, lineNumber, index } },
      );
    return l;
  };
  let charactersUpToLineStart = 0;
  while (charactersUpToLineStart + line().length < index) {
    charactersUpToLineStart += line().length;
    lineNumber++;
  }

  const columnNumber = index - charactersUpToLineStart + 1;

  return [lineNumber, columnNumber];
};
