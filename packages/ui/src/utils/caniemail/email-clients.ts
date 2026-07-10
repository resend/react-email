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

export type EmailClient = (typeof ALL_EMAIL_CLIENTS)[number];

export const DEFAULT_RELEVANT_EMAIL_CLIENTS = [
  'gmail',
  'apple-mail',
  'outlook',
  'yahoo',
] as const satisfies readonly EmailClient[];

const isEmailClient = (value: string): value is EmailClient =>
  (ALL_EMAIL_CLIENTS as readonly string[]).includes(value);

export const getRelevantEmailClients = (): readonly EmailClient[] => {
  const raw = process.env.COMPATIBILITY_EMAIL_CLIENTS;
  if (!raw) return DEFAULT_RELEVANT_EMAIL_CLIENTS;

  const requested = raw
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(isEmailClient);

  return requested.length > 0 ? requested : DEFAULT_RELEVANT_EMAIL_CLIENTS;
};
