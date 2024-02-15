export interface Rule {
  value: string;
  selector: string;
  content: string;
}

export function* rulesFor(cssWithRules: string) {
  for (const [fullRule, selector, content] of cssWithRules.matchAll(
    /\s*\.([\S]+)\s*{([^}]*)}/gm,
  )) {
    yield {
      value: fullRule,
      selector,
      content,
    } satisfies Rule;
  }
}
