// At-rules whose contents are conditional, so their declarations can't be
// inlined onto an element (e.g. `@media (prefers-color-scheme: dark)`). Shared
// so the "mark non-inlinable" (extract-rules-per-class) and "hoist out of the
// rule" (downlevel-for-email-clients) passes can't disagree on the set.
export const NON_INLINABLE_ATRULES = new Set(['media', 'supports']);
