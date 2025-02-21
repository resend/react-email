'use server';

import { parsePointingTableRows } from './spam-assassin/parse-pointing-table-rows';
import { sendToSpamd } from './spam-assassin/send-to-spamd';

interface Check {
  name: string;
  points: number;
  description: string;
}

export type SpamCheckingResult = {
  isSpam: boolean;
  points: number;
  checks: Check[];
};

export const checkSpam = async (
  html: string,
  plainText: string,
): Promise<SpamCheckingResult> => {
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
};
