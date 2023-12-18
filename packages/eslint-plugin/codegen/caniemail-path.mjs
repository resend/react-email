import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const codegenDir = dirname(fileURLToPath(import.meta.url));

export const CaniemailDir = join(codegenDir, "caniemail");
