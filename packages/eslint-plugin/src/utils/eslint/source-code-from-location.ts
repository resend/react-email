import type { TSESTree } from "@typescript-eslint/utils";
import type { SourceCode } from "@typescript-eslint/utils/ts-eslint";

export function sourceCodeFromLocation(
  sourceCode: SourceCode,
  location: TSESTree.SourceLocation,
) {
  return sourceCode
    .getText()
    .split("\n")
    .slice(location.start.line - 1, location.end.line)
    .map((line, index) => {
      if (location.end.line === location.start.line) {
        return line.slice(location.start.column, location.end.column);
      }

      if (index === 0) {
        return line.slice(location.start.column);
      } else if (index === location.end.line - location.start.line) {
        return line.slice(0, location.end.column);
      }

      return line;
    })
    .join("\n");
}
