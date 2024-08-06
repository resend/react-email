import type { TSESTree } from "@typescript-eslint/utils";
import type { SourceCode } from "@typescript-eslint/utils/ts-eslint";

export function sourceCodeFromLocation(
  sourceCode: SourceCode,
  location: [TSESTree.Position, TSESTree.Position],
) {
  return sourceCode
    .getText()
    .split("\n")
    .slice(location[0].line - 1, location[1].line)
    .map((line, index) => {
      if (location[1].line === location[0].line) {
        return line.slice(location[0].column, location[1].column);
      }

      if (index === 0) {
        return line.slice(location[0].column);
      } else if (index === location[1].line - location[0].line) {
        return line.slice(0, location[1].column);
      }

      return line;
    })
    .join("\n");
}
