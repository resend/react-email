import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fetch from "sync-fetch";
import { differenceInDays } from "date-fns";
import { SupportEntry, SupportResponse } from "./support-response";

const caniemailDataPath = "https://www.caniemail.com/api/data.json";

const caniemailCachedDataPath = path.resolve(
  os.tmpdir(),
  "caniemail-data.json",
);

/**
 * Caches the fetching of [data from caniemail](https://www.caniemail.com/api/data.json)
 * for 24 hours in a file inside of the user's tmpdir. Checks if the file is older than 24 hours
 * based on the last modified date for it.
 */
export const getAllSupportEntrries = () => {
  if (fs.existsSync(caniemailCachedDataPath)) {
    const stat = fs.statSync(caniemailCachedDataPath);

    // difference in days between last modified date and today
    if (differenceInDays(stat.mtime, new Date()) < 1) {
      return JSON.parse(
        fs.readFileSync(caniemailCachedDataPath, "utf-8"),
      ) as SupportEntry[];
    }
  }

  const responseFromCaniemail = fetch(caniemailDataPath);
  const json: SupportResponse = responseFromCaniemail.json();

  fs.writeFileSync(caniemailCachedDataPath, JSON.stringify(json.data), "utf-8");

  return json.data;
};
