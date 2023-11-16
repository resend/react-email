import type { TSESLint } from "@typescript-eslint/utils";
import type { Rule } from "eslint";

export function createRule<
  MessageIds extends string,
  RuleOptions extends unknown[],
>(rule: Omit<TSESLint.RuleModule<MessageIds, RuleOptions>, "defaultOptions">) {
  return rule as unknown as Rule.RuleModule;
}
