import { promises as fs } from "node:fs";
import path from "node:path";

await fs.cp(
  path.resolve(import.meta.dirname, "./node_modules/tailwindcss/types"),
  path.resolve(import.meta.dirname, "./dist/tailwindcss"),
  {
    recursive: true
  }
);
