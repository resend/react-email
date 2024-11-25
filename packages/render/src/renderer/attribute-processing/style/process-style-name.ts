import { hyphenateStyleName } from "./hyphenate-style-name";

const styleNameCache: Map<string, string> = new Map();
export function processStyleName(styleName: string): string {
  if (!styleNameCache.has(styleName)) {
    styleNameCache.set(styleName, hyphenateStyleName(styleName));
  }
  return styleNameCache.get(styleName)!;
}
