import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const caniemailDataURL =
  'https://www.caniemail.com/api/data-ordered.json';

const responseFromCaniemail = await fetch(caniemailDataURL);
if (!responseFromCaniemail.ok) {
  throw new Error(
    `Could not get the data from Caniemail and there is no cached data under your temporary folder to fallback for. 

This could be happneing for the following reasons:
- You don't have internet connectivity
- Caniemail is down
- Caniemail changed from where to fetch their data from, which means we need to fix this. If this is the case, please open up an issue.`,
  );
}

const response = await responseFromCaniemail.json();

await fs.writeFile(
  path.resolve(import.meta.dirname, '../src/caniemail/caniemail-data.ts'),
  `import type { SupportEntry } from "./support-entry-parsing.js";

export const nicenames = ${JSON.stringify(response.nicenames, null, 2)};

export const supportEntries: SupportEntry[] = ${JSON.stringify(response.data, null, 2)}`,
);
