// @ts-check

import { parseMarkdownMetadata } from './parse-markdown-metadata.mjs';
import { z } from 'zod'; 
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

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

export const getFeaturesDataWithPrefix = (prefix) => {
  const files = readdirSync('./caniemail/_features', { withFileTypes: true });

  const cssMarkdownFilenames = files
    .filter(file => file.isFile()
      && file.name.startsWith(`${prefix}-`)
      && file.name.endsWith('.md'))
    .map(file => join(file.path, file.name));
  const featuresWithFilename = cssMarkdownFilenames
    .map(filename => ({
      filename,
      feature: featureSchema.parse(
        parseMarkdownMetadata(readFileSync(filename, 'utf-8'))
      )
    }));

  return featuresWithFilename;
};
