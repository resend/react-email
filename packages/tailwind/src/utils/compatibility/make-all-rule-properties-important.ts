export function makeAllRulePropertiesImportant(ruleContent: string) {
  return ruleContent
    .split(";")
    .map((declaration) =>
      declaration.endsWith("!important")
        ? declaration.trim()
        : `${declaration.trim()}!important`,
    )
    .join(";");
}
