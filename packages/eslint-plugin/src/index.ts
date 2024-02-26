import type { Linter } from "eslint";
import type { TSESLint } from "@typescript-eslint/utils";
import {
  noUnsupportedOnGmailIOS,
  noPartiallyUnsupportedOnGmailIOS,
} from "./rules";
import { getAllSupportEntrries } from "./data/get-all-support-entries";

const caniemailSupportEntries = getAllSupportEntrries();

const rules = {
  "no-unsupported-on-gmail-ios": noUnsupportedOnGmailIOS(
    caniemailSupportEntries,
  ),
  "no-partially-supported-on-gmail-ios": noPartiallyUnsupportedOnGmailIOS(
    caniemailSupportEntries,
  ),
} satisfies TSESLint.Linter.Plugin["rules"];

const recommendedRules: Partial<Linter.RulesRecord> = {
  "react/jsx-key": "off",
  "@react-email/no-unsupported-on-gmail-ios": "error",
  "@react-email/no-partially-supported-on-gmail-ios": "warn",
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
