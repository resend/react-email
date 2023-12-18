// @ts-check

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { CaniemailDir } from "../caniemail-path.mjs";
import { parseMarkdownMetadata } from "./parse-markdown-metadata.mjs";

export const featureSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  keywords: z.string().nullish(),
  last_test_date: z.string(),
  stats: z.record(
    z.string(), // email client
    z.record(
      z.string(), // operating system
      z.record(
        z.string(), // os version
        z.string(), // y for supported and anything else for somwehat of supported
      ),
    ),
  ),
  notes: z.string().optional(),
  links: z.record(z.string(), z.string()).optional(),
});

/**
 * @param prefix {string}
 */
export const getFeaturesDataWithPrefix = async (prefix) => {
  const files = await readdir(join(CaniemailDir, "_features"), {
    withFileTypes: true,
  });

  const cssMarkdownFilenames = files
    .filter(
      (file) =>
        file.isFile() &&
        file.name.startsWith(`${prefix}-`) &&
        file.name.endsWith(".md"),
    )
    .map((file) => join(file.path, file.name));
  const featuresWithFilename = await Promise.all(
    cssMarkdownFilenames.map(async (filename) => ({
      filename,
      feature: featureSchema.parse(
        parseMarkdownMetadata(await readFile(filename, "utf-8")),
      ),
    })),
  );

  return featuresWithFilename;
};
