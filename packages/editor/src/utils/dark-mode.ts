/**
 * CSS injected into the email head to keep content visible in dark-mode mail
 * clients (Apple Mail / iOS), which auto-darken light emails by recoloring text
 * but leave some properties — like native list markers — at their original
 * color. `::marker` can't be styled inline, so the rules have to live here.
 */
export const DARK_MODE_CSS =
  '@media (prefers-color-scheme: dark){li::marker{color:#c4c4c4}}';
