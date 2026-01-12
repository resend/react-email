import path from 'node:path';

export const getEnvVariablesForPreviewApp = (
  relativePathToEmailsDirectory: string,
  previewServerLocation: string,
  cwd: string,
  compatibilityClients: string[],
  resendApiKey?: string,
) => {
  return {
    EMAILS_DIR_RELATIVE_PATH: relativePathToEmailsDirectory,
    EMAILS_DIR_ABSOLUTE_PATH: path.resolve(cwd, relativePathToEmailsDirectory),
    PREVIEW_SERVER_LOCATION: previewServerLocation,
    USER_PROJECT_LOCATION: cwd,
    RESEND_API_KEY: resendApiKey,
    COMPATIBILITY_EMAIL_CLIENTS: compatibilityClients.join(','),
  } as const;
};
