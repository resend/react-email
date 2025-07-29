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

    const match = line.match(columnsRegex);

    // This means the description column was done with multi columns.
    if (currentRow && line.startsWith('  ')) {
      currentRow.description += ` ${line.trimStart()}`;
      continue;
    }

    if (match?.groups === undefined) {
      console.log(line);
      throw new Error('Could not match the columns in the row', {
        cause: {
          line,
          match,
        },
      });
    }
    const pts = match.groups.pts!;
    const ruleName = match.groups.ruleName!.trim();
    const description = match.groups.description!;

    if (currentRow) {
      rows.push(currentRow);
    }
    const parsedPoints = Number.parseFloat(pts);
    if (Number.isNaN(parsedPoints)) {
      console.log(line);
      throw new Error('could not parse points to insert into rows array', {
        cause: {
          line,
          match,
        },
      });
    }
    currentRow = {
      pts: parsedPoints,
      ruleName: ruleName.trim(),
      description: description.trim(),
    };
  }
  if (currentRow) {
    rows.push(currentRow);
  }

  return rows;
};
