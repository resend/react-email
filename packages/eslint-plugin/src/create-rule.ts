import type { TSESLint } from "@typescript-eslint/utils";

export function createRule<
  MessageIds extends string,
  RuleOptions extends unknown[],
>(rule: Omit<TSESLint.RuleModule<MessageIds, RuleOptions>, "defaultOptions">) {
  return rule as unknown as TSESLint.RuleModule<MessageIds, RuleOptions>;
}
