import * as stackTraceParser from 'stacktrace-parser';
import { SourceMapConsumer, type RawSourceMap } from 'source-map-js';
import type { ErrorObject } from './types/error-object';

export const improveErrorWithSourceMap = (
  error: Error,

  originalFilePath: string,
  sourceMapToOriginalFile: RawSourceMap,
): ErrorObject => {
  let stack: string | undefined;

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
          const columnAndLine =
            positionWithError.column && positionWithError.line
              ? `${positionWithError.line}:${positionWithError.column}`
              : positionWithError.line;
          newStackLines.push(
            ` at ${stackFrame.methodName} (${originalFilePath}:${columnAndLine})`,
          );
        } else {
          newStackLines.push(
            ` at ${stackFrame.methodName} (${originalFilePath})`,
          );
        }
      } else {
        const columnAndLine =
          stackFrame.column && stackFrame.lineNumber
            ? `${stackFrame.lineNumber}:${stackFrame.column}`
            : stackFrame.lineNumber;
        newStackLines.push(
          ` at ${stackFrame.methodName} (${stackFrame.file}:${columnAndLine})`,
        );
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
