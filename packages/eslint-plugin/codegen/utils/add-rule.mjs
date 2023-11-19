// @ts-check

import { readFileSync, writeFileSync } from "fs"

import { camelize } from "./camelize.mjs";

/**
  * @param content {string} The contents of the typescript file associated with the rule.
  * Must export the created rule as default so that the exports work properly.
  *
  * @param feature {string}
  */
export const addRule = (content, feature) => {
  console.warn(`WARNING: The file for the ${feature} seems to already exist, this is going to overwrite that file`);

  const ruleBasename = `no-${feature}`;
  writeFileSync(`./src/rules/${ruleBasename}.ts`, content);
  const camelCasedRule = camelize(feature);
  const currentIndexContents = readFileSync('./src/rules/index.ts', 'utf-8');

  writeFileSync(
    './src/rules/index.ts', 
    `import ${camelCasedRule} from './${ruleBasename}';\n${currentIndexContents}\nexport { ${camelCasedRule} };`
  );
}
