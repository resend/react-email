/**
 * Transforms raw example source code into a minimal, copy-pasteable snippet
 * by stripping the ExampleShell wrapper and its import.
 */
export function stripExampleShell(source: string): string {
  let result = source;

  // Remove the ExampleShell import line
  result = result.replace(
    /import \{ ExampleShell \} from '\.\.\/example-shell';\n/,
    '',
  );

  // Remove <ExampleShell ...> opening tag (may span multiple lines)
  result = result.replace(/\s*<ExampleShell\b[^>]*>\n?/, '\n');

  // Remove </ExampleShell> closing tag
  result = result.replace(/\s*<\/ExampleShell>\n?/, '\n');

  // Dedent the content that was inside ExampleShell by 2 spaces within the
  // return statement. We find the component function's return block and fix
  // the extra indentation level that wrapping in ExampleShell introduced.
  // The content inside the return (...) was indented 6 spaces (3 levels) for
  // ExampleShell children; after removing the wrapper it should be 4 (2 levels).
  const lines = result.split('\n');
  let inReturn = false;
  let parenDepth = 0;

  const dedented = lines.map((line) => {
    if (/^\s*return \(/.test(line)) {
      inReturn = true;
      parenDepth = 1;
      return line;
    }

    if (inReturn) {
      for (const ch of line) {
        if (ch === '(') parenDepth++;
        if (ch === ')') parenDepth--;
      }

      if (parenDepth <= 0) {
        inReturn = false;
        return line;
      }

      // Dedent by 2 spaces if possible
      if (line.startsWith('      ')) {
        return line.slice(2);
      }
    }

    return line;
  });

  return dedented.join('\n').trim() + '\n';
}
