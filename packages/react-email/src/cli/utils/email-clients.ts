// Kept in sync with ALL_EMAIL_CLIENTS in
// packages/ui/src/actions/email-validation/check-compatibility.ts.
// Duplicated here so the CLI can validate --clients without depending on
// @react-email/ui at runtime.
export const ALL_EMAIL_CLIENTS = [
  'gmail',
  'outlook',
  'yahoo',
  'apple-mail',
  'aol',
  'thunderbird',
  'microsoft',
  'samsung-email',
  'sfr',
  'orange',
  'protonmail',
  'hey',
  'mail-ru',
  'fastmail',
  'laposte',
  't-online-de',
  'free-fr',
  'gmx',
  'web-de',
  'ionos-1and1',
  'rainloop',
  'wp-pl',
] as const;
