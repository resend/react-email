/** ONLY ACCESSIBLE ON THE SERVER */
export const userProjectLocation = process.env.USER_PROJECT_LOCATION!;

/** ONLY ACCESSIBLE ON THE SERVER */
export const previewServerLocation = process.env.PREVIEW_SERVER_LOCATION!;

/** ONLY ACCESSIBLE ON THE SERVER */
export const emailsDirectoryAbsolutePath =
  process.env.EMAILS_DIR_ABSOLUTE_PATH!;

/** ONLY ACCESSIBLE ON THE SERVER */
export const resendApiKey = process.env.RESEND_API_KEY;

/**
 * Comma-separated list of email clients to show compatibility warnings for.
 * If not set, defaults to ['gmail', 'apple-mail', 'outlook', 'yahoo'].
 * ONLY ACCESSIBLE ON THE SERVER
 */
export const compatibilityEmailClients =
  process.env.COMPATIBILITY_EMAIL_CLIENTS;

export const isBuilding = process.env.NEXT_PUBLIC_IS_BUILDING === 'true';

export const isPreviewDevelopment =
  process.env.NEXT_PUBLIC_IS_PREVIEW_DEVELOPMENT === 'true';
