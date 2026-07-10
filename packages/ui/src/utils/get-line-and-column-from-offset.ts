export const getLineAndColumnFromOffset = (
  offset: number,
  content: string,
): [line: number, column: number] => {
  // `\r\n` must come first in the alternation so a CRLF is matched as a single
  // line break. With `\n|\r|\r\n`, the `\r` branch would match first, so a CRLF
  // would count as two line breaks and inflate both the line and the column.
  //
  // We also scan the whole `content` (not `content.slice(0, offset)`) and keep
  // only the breaks that fully end at or before `offset`. That way an `offset`
  // landing between the `\r` and `\n` of a CRLF isn't mistaken for a lone `\r`.
  const precedingLineBreaks = [...content.matchAll(/\r\n|\n|\r/g)].filter(
    (lineBreak) => lineBreak.index + lineBreak[0].length <= offset,
  );

  const line = precedingLineBreaks.length + 1;

  // Column is measured from the character right after the last line break.
  // On line 1 (no preceding break) this keeps the original 0-based first column.
  const lastLineBreak = precedingLineBreaks[precedingLineBreaks.length - 1];
  const column = lastLineBreak
    ? offset - (lastLineBreak.index + lastLineBreak[0].length) + 1
    : offset;

  return [line, column];
};
