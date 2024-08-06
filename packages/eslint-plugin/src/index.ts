import type { TSESLint } from "@typescript-eslint/utils";
import * as Rules from "./rules";
import { getAllSupportEntrries } from "./data/get-all-support-entries";
import { fromCamelToKebabCase } from "./casing/from-camel-to-kebab-case";
import { separateEntriesByCategory } from "./data/separate-entries-by-category";

const caniemailSupportEntries = getAllSupportEntrries();

const entriesByCategory = separateEntriesByCategory(caniemailSupportEntries);

const rules = Object.fromEntries(
  Object.entries(Rules).map(([ruleCamelCasedName, ruleFactory]) => [
    fromCamelToKebabCase(ruleCamelCasedName),
    ruleFactory(entriesByCategory),
  ]),
);

const plugin: TSESLint.Linter.Plugin = {
  configs: {
    recommended: {
      rules: {
        "react/jsx-key": "off",

        // rules for gmail
        "@react-email/no-unsupported-on-gmail-desktop-webmail": "error",
        "@react-email/no-partially-supported-on-gmail-desktop-webmail": "warn",
        "@react-email/no-unsupported-on-gmail-ios": "error",
        "@react-email/no-partially-supported-on-gmail-ios": "warn",
        "@react-email/no-unsupported-on-gmail-android": "error",
        "@react-email/no-partially-supported-on-gmail-android": "warn",
        "@react-email/no-unsupported-on-gmail-mobile-webmail": "error",
        "@react-email/no-partially-supported-on-gmail-mobile-webmail": "warn",

        // rules for apple mail
        "@react-email/no-unsupported-on-apple-mail-macos": "error",
        "@react-email/no-partially-supported-on-apple-mail-macos": "warn",
        "@react-email/no-unsupported-on-apple-mail-ios": "error",
        "@react-email/no-partially-supported-on-apple-mail-ios": "warn",

        // rules for outlook
        "@react-email/no-unsupported-on-outlook-windows": "error",
        "@react-email/no-partially-supported-on-outlook-windows": "warn",
        "@react-email/no-unsupported-on-outlook-windows-mail": "error",
        "@react-email/no-partially-supported-on-outlook-windows-mail": "warn",
        "@react-email/no-unsupported-on-outlook-macos": "error",
        "@react-email/no-partially-supported-on-outlook-macos": "warn",
        "@react-email/no-unsupported-on-outlook-outlook-com": "error",
        "@react-email/no-partially-supported-on-outlook-outlook-com": "warn",
        "@react-email/no-unsupported-on-outlook-ios": "error",
        "@react-email/no-partially-supported-on-outlook-ios": "warn",
        "@react-email/no-unsupported-on-outlook-android": "error",
        "@react-email/no-partially-supported-on-outlook-android": "warn",

        // rules for yahoo
        "@react-email/no-unsupported-on-yahoo-desktop-webmail": "error",
        "@react-email/no-partially-supported-on-yahoo-desktop-webmail": "warn",
        "@react-email/no-unsupported-on-yahoo-ios": "error",
        "@react-email/no-partially-supported-on-yahoo-ios": "warn",
        "@react-email/no-unsupported-on-yahoo-android": "error",
        "@react-email/no-partially-supported-on-yahoo-android": "warn",

        // rules for hey
        "@react-email/no-unsupported-on-hey-desktop-webmail": "error",
        "@react-email/no-partially-supported-on-hey-desktop-webmail": "warn",
      },
    },
  },
  rules,
};

export default plugin;
