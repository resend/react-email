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

  // Dedent only the exported component's return block. After removing the
  // ExampleShell wrapper, the inner JSX has one extra level of indentation.
  const lines = result.split('\n');
  let inExportedReturn = false;
  let seenExport = false;
  let parenDepth = 0;

  const dedented = lines.map((line) => {
    if (/^export function\b/.test(line)) {
      seenExport = true;
    }

    if (seenExport && !inExportedReturn && /^\s*return \(/.test(line)) {
      inExportedReturn = true;
      parenDepth = 1;
      return line;
    }

    if (inExportedReturn) {
      for (const ch of line) {
        if (ch === '(') parenDepth++;
        if (ch === ')') parenDepth--;
      }

      if (parenDepth <= 0) {
        inExportedReturn = false;
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
