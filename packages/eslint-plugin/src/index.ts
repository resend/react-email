import type { Linter } from "eslint";
import type { TSESLint } from "@typescript-eslint/utils";
import * as Rules from "./rules";
import { getAllSupportEntrries } from "./data/get-all-support-entries";
import { fromCaemlToKebabCase } from "./casing/from-camel-to-kebab-case";

const caniemailSupportEntries = getAllSupportEntrries();

const rules = Object.fromEntries(
  Object.entries(Rules).map(([ruleCamelCasedName, ruleFactory]) => [
    fromCaemlToKebabCase(ruleCamelCasedName),
    ruleFactory(caniemailSupportEntries),
  ]),
);

const recommendedRules: Partial<Linter.RulesRecord> = {
  "react/jsx-key": "off",
  ...Object.fromEntries(
    Object.keys(rules).map((rule) => [
      `@react-email/${rule}`,
      rule.startsWith("no-partially-supported") ? "warn" : "error",
    ]),
  ),
};

const plugin: TSESLint.Linter.Plugin = {
  configs: {
    recommended: {
      rules: recommendedRules,
    },
  },
  rules,
};

export default plugin;
