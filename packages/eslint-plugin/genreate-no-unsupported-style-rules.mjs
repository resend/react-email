import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { z } from 'zod';

import { load } from "js-yaml";
import { basename, join } from 'path';
export const parseMarkdownMetadata = (
  contents
) => {
  const lines = contents.split("\n");
  const metaIndices = lines.reduce((mem, item, i) => {
    if (/^---/.test(item)) {
      mem.push(i);
    }

    return mem;
  }, []);

  if (metaIndices.length > 0) {
    const metadata = lines.slice(metaIndices[0] + 1, metaIndices[1]);
    return load(metadata.join("\n"), {
      json: true,
    });
  }

  return undefined;
};

const featureSchema = z.object({
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

const files = readdirSync('./caniemail/_features', { withFileTypes: true });
const cssMarkdownFilenames = files
  .filter(file => file.isFile()
    && file.name.startsWith('css-')
    && file.name.endsWith('.md'))
  .map(file => join(file.path, file.name));
const featuresWithFilename = cssMarkdownFilenames
  .map(filename => ({
    filename,
    feature: featureSchema.parse(
      parseMarkdownMetadata(readFileSync(filename, 'utf-8'))
    )
  }));

let indexContents = '';
const rulesCamelCasedNameToExport = [];
for (const { filename, feature } of featuresWithFilename) {
  let supportedEnvironments = 0;
  let allEnvironments = 0;
  for (const versionSupportPerOs of Object.values(feature.stats)) {
    for (const supportPerVersion of Object.values(versionSupportPerOs)) {
      for (const supported of Object.values(supportPerVersion)) {
        allEnvironments++;
        if (supported === 'y') {
          supportedEnvironments++;
        }
      }
    }
  }

  const supportPercetange = supportedEnvironments / allEnvironments;

  if (supportPercetange < 0.90) { // means it is mostly unsupported
    const cssProperty = basename(filename, '.md').replace('css-', '');
    const ruleBasename = `no-${cssProperty}`;
    writeFileSync(`./src/rules/${ruleBasename}.ts`, `import { createStyleRule } from "../utils/create-style-rule";

export default createStyleRule(
  '${cssProperty}', 
  ${supportPercetange * 100}, 
  'https://www.caniemail.com/features/${basename(filename, '.md')}/'
);
`);
    const camelCased = ruleBasename.replace(/-([a-z])/g, function(g) {
      return g[1].toUpperCase();
    })
    indexContents += `import ${camelCased} from './${ruleBasename}'\n`;
    rulesCamelCasedNameToExport.push(camelCased);
  }
}

indexContents += `export { ${rulesCamelCasedNameToExport.join(', ')} }`;

writeFileSync('./src/rules/index.ts', indexContents);
