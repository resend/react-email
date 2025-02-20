import { parsePointingTableRows } from '@/utils/spam-assassin/parse-pointing-table-rows';
import { sendToSpamd } from '@/utils/spam-assassin/send-to-spamd';

export async function checkSpam(html: string, plainText: string) {
  const response = await sendToSpamd(html, plainText);

  const tableRows = parsePointingTableRows(response);

  const filteredRows = tableRows.filter(
    (row) =>
      !row.description.toLowerCase().includes('header') &&
      !row.ruleName.includes('HEADER') &&
      row.pts !== 0,
  );

  const checks = filteredRows.map((row) => ({
    name: row.ruleName,
    description: row.description,
    points: row.pts,
  }));

  const points = checks.reduce((acc, check) => acc + check.points, 0);

  return {
    checks,
    isSpam: points >= 5.0,
    points,
  };
}
