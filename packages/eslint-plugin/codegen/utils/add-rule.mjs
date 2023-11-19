// @ts-check

import { existsSync, readFileSync, writeFileSync } from "fs"

import { camelize } from "./camelize.mjs";

/**
  * @description Inserts the {@link content} into a new file at `src/rules/no-${feature}` ({@link feature})
  * and then adds an import and export of this new rule to the file at `src/rules/index.ts`.
  *
  * @param content {string} The contents of the typescript file associated with the rule.
  * Must export the created rule as default so that the exports work properly.
  *
  * @param feature {string} The **kebab-cased** name of the feature that this rule is meant to avoid
  */
export const addRule = (content, feature) => {
  const ruleBasename = `no-${feature}`;
  const newRuleFilename = `./src/rules/${ruleBasename}.ts`;

  if (existsSync(newRuleFilename)) {
    console.warn(`WARNING: The file for the ${feature} seems to already exist, overwriting that file now`);
  }

  writeFileSync(newRuleFilename, content);
  const camelCasedRule = camelize(feature);
  const currentIndexContents = readFileSync('./src/rules/index.ts', 'utf-8');

  writeFileSync(
    './src/rules/index.ts', 
    `import ${camelCasedRule} from './${ruleBasename}';\n${currentIndexContents}\nexport { ${camelCasedRule} };`
  );
}
