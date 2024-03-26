import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fetch from "sync-fetch";
import { differenceInDays } from "date-fns";
import type {
  SupportEntry,
  CaniemailOrderedDataResponse,
} from "./support-response";

export const caniemailDataURL =
  "https://www.caniemail.com/api/data-ordered.json";

const caniemailCachedDataPath = path.resolve(
  os.tmpdir(),
  "caniemail-data.json",
);

/**
 * Caches the fetching of [data from caniemail](https://www.caniemail.com/api/data-ordered.json)
 * for 24 hours in a file inside of the user's tmpdir. Checks if the file is older than 24 hours
 * based on the last modified date for it.
 */
export const getAllSupportEntrries = () => {
  let dataFromCanIEmail: SupportEntry[] | undefined;

  try {
    const fd = fs.openSync(caniemailCachedDataPath, "r");
    const stat = fs.fstatSync(fd);

    // keep the data inside of dataFromCanIEmail so that
    // if the fetch fails - probably because the user doesn't have
    // internet connectivity - we can use the cached data, even though it is stale
    dataFromCanIEmail = JSON.parse(
      fs.readFileSync(fd, "utf-8"),
    ) as SupportEntry[];

    // difference in days between last modified date and today
    if (differenceInDays(stat.mtime, new Date()) < 1) {
      return dataFromCanIEmail;
    }
  } catch (_exception) {
    // throwing means the cached file didn't exist or it was older than 24 hours
    const responseFromCaniemail = fetch(caniemailDataURL);
    if (!responseFromCaniemail.ok) {
      if (dataFromCanIEmail === undefined) {
        throw new Error(
          `Could not get the data from Caniemail and there is no cached data under your temporary folder to fallback for. 

This could be happneing for the following reasons:
- You don't have internet connectivity
- Caniemail is down
- Caniemail changed from where to fetch their data from, which means we need to fix this. If this is the case, please open up an issue.`,
          {
            cause: {
              responseFromCaniemail,
              _exception,
            },
          },
        );
      }

      return dataFromCanIEmail;
    }
    const json = responseFromCaniemail.json() as CaniemailOrderedDataResponse;

    fs.writeFileSync(
      caniemailCachedDataPath,
      JSON.stringify(json.data),
      "utf-8",
    );

    dataFromCanIEmail = json.data;
  }

  return dataFromCanIEmail;
};
