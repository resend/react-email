import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fetch from "sync-fetch";
import { differenceInDays } from "date-fns";
import type { SupportEntry, SupportResponse } from "./support-response";

export const caniemailDataURL = "https://www.caniemail.com/api/data.json";

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
  let dataFromCanIEmail: SupportEntry[];

  try {
    const fd = fs.openSync(caniemailCachedDataPath, "r");
    const stat = fs.fstatSync(fd);

    // difference in days between last modified date and today
    if (differenceInDays(stat.mtime, new Date()) < 1) {
      dataFromCanIEmail = JSON.parse(
        fs.readFileSync(fd, "utf-8"),
      ) as SupportEntry[];
    } else {
      throw new Error("File is older than 24 hours");
    }
  } catch (_exception) {
    // throwing means the cached file didn't exist or it was older than 24 hours
    const responseFromCaniemail = fetch(caniemailDataURL);
    const json = responseFromCaniemail.json() as SupportResponse;

    fs.writeFileSync(
      caniemailCachedDataPath,
      JSON.stringify(json.data),
      "utf-8",
    );

    dataFromCanIEmail = json.data;
  }

  return dataFromCanIEmail;
};
