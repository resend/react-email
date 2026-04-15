import path from 'node:path';
import { type RawSourceMap, SourceMapConsumer } from 'source-map-js';
import * as stackTraceParser from 'stacktrace-parser';

export const convertStackWithSourceMap = (
  rawStack: string | undefined,

  originalFilePath: string,
  sourceMapToOriginalFile: RawSourceMap,
): string | undefined => {
  let stack: string | undefined;

  const sourceRoot =
    sourceMapToOriginalFile.sourceRoot ?? path.dirname(originalFilePath);

  const getStackLineFromMethodNameAndSource = (
    methodName: string,
    source: string,
    line: number | undefined | null,
    column: number | undefined | null,
  ) => {
    const columnAndLine =
      column || line
        ? `${line ?? ''}${line && column ? ':' : ''}${column ?? ''}`
        : undefined;
    const sourceToDisplay = path.relative(sourceRoot, source);
    return methodName === '<unknown>'
      ? ` at ${sourceToDisplay}${columnAndLine ? `:${columnAndLine}` : ''}`
      : ` at ${methodName} (${sourceToDisplay}${
          columnAndLine ? `:${columnAndLine}` : ''
        })`;
  };

  if (rawStack) {
    const parsedStack = stackTraceParser.parse(rawStack);
    const sourceMapConsumer = new SourceMapConsumer(sourceMapToOriginalFile);
    const newStackLines = [] as string[];
    for (const stackFrame of parsedStack) {
      if (stackFrame.file === originalFilePath) {
        if (stackFrame.column || stackFrame.lineNumber) {
          const positionWithError = sourceMapConsumer.originalPositionFor({
            column: stackFrame.column ?? 0,
            line: stackFrame.lineNumber ?? 0,
          });

          newStackLines.push(
            getStackLineFromMethodNameAndSource(
              stackFrame.methodName,
              // This can actually be null
              positionWithError.source ?? stackFrame.file,
              positionWithError.line,
              positionWithError.column,
            ),
          );
        } else {
          newStackLines.push(
            getStackLineFromMethodNameAndSource(
              stackFrame.methodName,
              stackFrame.file,
              stackFrame.lineNumber,
              stackFrame.column,
            ),
          );
        }
      } else if (stackFrame.file) {
        const stackLine = getStackLineFromMethodNameAndSource(
          stackFrame.methodName,
          stackFrame.file,
          stackFrame.lineNumber,
          stackFrame.column,
        );
        newStackLines.push(stackLine);
      }
    }
    stack = newStackLines.join('\n');
  }

  return stack;
};
