import path from 'node:path';
import { type RawSourceMap, SourceMapConsumer } from 'source-map-js';
import * as stackTraceParser from 'stacktrace-parser';
import type { ErrorObject } from './types/error-object';

export const improveErrorWithSourceMap = (
  error: Error,

  originalFilePath: string,
  sourceMapToOriginalFile: RawSourceMap,
): ErrorObject => {
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

  if (typeof error.stack !== 'undefined') {
    const parsedStack = stackTraceParser.parse(error.stack);
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
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

  return {
    name: error.name,
    message: error.message,
    cause: error.cause,
    stack,
  };
};
