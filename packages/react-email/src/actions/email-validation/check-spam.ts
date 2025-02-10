'use server';

import type { ErrorObject } from '../../utils/types/error-object';
import { parsePointingTableRows } from './spam-assassin/parse-pointing-table-rows';
import { sendToSpamd } from './spam-assassin/send-to-spamd';

interface Check {
  name: string;
  points: number;
  description: string;
}

type SpamCheckingResult =
  | {
      isSpam: boolean;
      points: number;
      checks: Check[];
    }
  | { error: ErrorObject };

export const checkSpam = async (
  html: string,
  plainText: string,
): Promise<SpamCheckingResult> => {
  const response = await sendToSpamd(html, plainText);

  const tableRows = parsePointingTableRows(response);

  const result: SpamCheckingResult = {
    checks: [],
    isSpam: false,
    points: 0,
  };

  return result;
};
