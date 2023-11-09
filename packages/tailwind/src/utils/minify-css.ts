export function minifyCSS(css: string): string {
  return (
    css

      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//gm, "")

      // Remove extra spaces after semicolons and colons
      .replace(/;\s+/gm, ";")
      .replace(/:\s+/gm, ":")

      // Remove extra spaces before and after brackets
      .replace(/\)\s*{/gm, "){") // Remove spaces before opening curly brace after closing parenthesis
      .replace(/\s+\(/gm, "(") // Remove spaces before opening parenthesis
      .replace(/{\s+/gm, "{") // Remove spaces after opening curly brace
      .replace(/}\s+/gm, "}") // Remove spaces before closing curly brace
      .replace(/\s*{/gm, "{") // Remove spaces after opening curly brace
      .replace(/;?\s*}/gm, "}")
  ); // Remove extra spaces and semicolons before closing curly braces
}
