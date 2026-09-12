import type { ColorScheme } from './dark-mode-preview';

/**
 * The original condition of every media rule that has been rewritten, so a
 * later call always derives its target from the email's own CSS rather than
 * from whatever the previous call left behind.
 *
 * Keyed by the rule object, which the CSSOM keeps alive for exactly as long as
 * the document that owns it — when the preview reloads the iframe, the entries
 * for the old document become collectable on their own.
 */
const originalMediaText = new WeakMap<CSSRule, string>();

const colorSchemePreference = /(prefers-color-scheme\s*:\s*)(dark|light)/gi;

function flipColorSchemePreferences(mediaText: string) {
  return mediaText.replace(colorSchemePreference, (_, feature, scheme) =>
    scheme.toLowerCase() === 'dark' ? `${feature}light` : `${feature}dark`,
  );
}

/**
 * Renders a document as though the reader's color scheme preference were `to`,
 * whatever the browser actually reports it as (`from`).
 *
 * `color-scheme` on the `<iframe>` already does this wherever the browser
 * propagates it into the embedded document, and there `from` comes back equal
 * to `to` and nothing below runs. But that propagation only reaches
 * `prefers-color-scheme` in Firefox 105+ and Chromium 129+, and Safari doesn't
 * ship it at all yet — it landed in Safari Technology Preview 242, April 2026.
 * Left at that, the preview would render an email one way on Chrome and another
 * on Safari, and on Safari would just inherit whatever the reader's OS is set
 * to, in every mode.
 *
 * So where the browser doesn't do it, the preference is applied to the CSS
 * instead: every `prefers-color-scheme` condition gets its value flipped, which
 * turns the queries the reader's real setting matches into the ones it doesn't,
 * and vice versa. Only the leaf value changes, so the browser still evaluates
 * the surrounding `and`/`or`/`not` and the comma-separated query list itself —
 * no media query parsing here.
 *
 * Two properties this has that lifting the rules into an appended `<style>`
 * would not:
 *
 * - Rules keep their place in the cascade. Hoisting them to the end of `<head>`
 *   lets a dark rule win over a light rule that was authored after it, which a
 *   real client would resolve the other way around.
 * - `prefers-color-scheme: light` rules are handled too, instead of staying
 *   matched while the dark ones are forced on top of them.
 *
 * Only the live CSSOM is touched, never the `<style>` elements' text, so the
 * markup the preview shows in its source view stays the email as authored.
 */
export function forceColorScheme(
  document: Document,
  { from, to }: { from: ColorScheme; to: ColorScheme },
) {
  // The browser already reports what we want, so its own evaluation of the
  // email's queries is right — and leaving the CSS untouched is more faithful
  // than any rewrite could be.
  const shouldFlip = from !== to;

  const { styleSheets } = document;
  for (let index = 0; index < styleSheets.length; index++) {
    const styleSheet = styleSheets[index];
    if (!styleSheet) continue;

    try {
      forceOnRules(styleSheet.cssRules, shouldFlip);
    } catch {
      // A stylesheet from another origin throws on `cssRules`. Nothing to read,
      // so skip it rather than losing the sheets that follow.
    }
  }
}

function forceOnRules(rules: CSSRuleList, shouldFlip: boolean) {
  for (let index = 0; index < rules.length; index++) {
    const rule = rules[index];
    if (!rule) continue;

    // Duck-typing rather than `instanceof CSSMediaRule`: these rules belong to
    // the preview iframe's realm, so the parent document's constructors never
    // match them. `@import` carries a media list too, and is worth rewriting
    // for the same reason.
    const media = (rule as CSSMediaRule).media;
    if (typeof media?.mediaText === 'string') {
      forceOnMediaList(rule, media, shouldFlip);
    }

    // `@media` nested inside `@supports`, `@layer` or a container query is
    // still a color scheme query the email expects to be honored.
    const nestedRules = (rule as CSSGroupingRule).cssRules;
    if (nestedRules) forceOnRules(nestedRules, shouldFlip);
  }
}

function forceOnMediaList(
  rule: CSSRule,
  media: MediaList,
  shouldFlip: boolean,
) {
  const recorded = originalMediaText.get(rule);
  const original = recorded ?? media.mediaText;
  const flipped = flipColorSchemePreferences(original);

  // Flipping changed nothing, so there was no color scheme condition to force.
  if (flipped === original) return;

  if (recorded === undefined) originalMediaText.set(rule, original);

  const target = shouldFlip ? flipped : original;
  if (media.mediaText !== target) media.mediaText = target;
}
