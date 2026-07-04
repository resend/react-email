export const parsePointingTableRows = (response: string) => {
  const tableHeader =
    /pts\s+rule\s+name\s+description\s+(?<ptsWidth>-+) (?<ruleNameWidth>-+) (?<descriptionWidth>-+) *(?:\r\n|\n|\r)*/;
  const tableStartMatch = response.match(tableHeader);

  if (
    tableStartMatch === null ||
    tableStartMatch.index === undefined ||
    tableStartMatch.groups === undefined
  ) {
    throw new Error('Could not find spam checking points table');
  }

  const ptsWidth = tableStartMatch.groups.ptsWidth!.length;
  const columnsRegex = new RegExp(
    `^(?<pts>.{${ptsWidth}}) (?<ruleName>.+?) (?<description>.+}|.+$)`,
  );

  interface Row {
    pts: number;
    ruleName: string;
    description: string;
  }

  const rows: Row[] = [];

  const responseFromTableStart = response.slice(
    tableStartMatch.index + tableStartMatch[0].length,
  );
  let currentRow: Row | undefined;
  for (const line of responseFromTableStart.split(/\r\n|\n|\r/)) {
    if (line.trim().length === 0) break;

    // This means the description column was done with multi columns.
    if (currentRow && line.startsWith('  ')) {
      currentRow.description += ` ${line.trimStart()}`;
      continue;
    }

    const match = line.match(columnsRegex);
    const parsedPoints = match?.groups
      ? Number.parseFloat(match.groups.pts!)
      : Number.NaN;

    // Lines that don't look like a row are wrapping artifacts — SpamAssassin
    // word-wraps long descriptions (e.g. long URIs) at unpredictable indents.
    if (match?.groups === undefined || Number.isNaN(parsedPoints)) {
      if (currentRow) {
        currentRow.description += ` ${line.trim()}`;
      }
      continue;
    }

    if (currentRow) {
      rows.push(currentRow);
    }
    currentRow = {
      pts: parsedPoints,
      ruleName: match.groups.ruleName!.trim(),
      description: match.groups.description!.trim(),
    };
  }
  if (currentRow) {
    rows.push(currentRow);
  }

  return rows;
};
