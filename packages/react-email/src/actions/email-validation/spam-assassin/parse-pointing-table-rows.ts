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
  const ruleNameWidth = tableStartMatch.groups.ruleNameWidth!.length;
  const descriptionWidth = tableStartMatch.groups.descriptionWidth!.length;
  const columnsRegex = new RegExp(
    `^(?<pts>.{${ptsWidth}}) (?<ruleName>.{${ruleNameWidth}}) (?<description>.{${descriptionWidth}}|.+$)`,
  );

  const rows: {
    pts: number;
    ruleName: string;
    description: string;
  }[] = [];

  const responseFromTableStart = response.slice(
    tableStartMatch.index + tableStartMatch[0].length,
  );
  for (const line of responseFromTableStart.split(/\r\n|\n|\r/)) {
    if (line.trim().length === 0) break;

    const match = line.match(columnsRegex);
    if (match?.groups === undefined) {
      throw new Error('Could not match the columns in the row', {
        cause: {
          line,
          match,
        },
      });
    }
    const pts = match.groups.pts!;
    const ruleName = match.groups.ruleName!;
    const description = match.groups.description!;

    try {
      rows.push({
        pts: Number.parseFloat(pts),
        ruleName: ruleName.trim(),
        description: description.trim(),
      });
    } catch (_) {}
  }

  return rows;
};
