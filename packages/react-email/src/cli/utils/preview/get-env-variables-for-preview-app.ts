import path from 'node:path';

export const getEnvVariablesForPreviewApp = (
  relativePathToEmailsDirectory: string,
  previewServerLocation: string,
  cwd: string,
  resendApiKey?: string,
  compatibilityClients?: string,
) => {
  return {
    REACT_EMAIL_INTERNAL_EMAILS_DIR_RELATIVE_PATH:
      relativePathToEmailsDirectory,
    REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH: path.resolve(
      cwd,
      relativePathToEmailsDirectory,
    ),
    REACT_EMAIL_INTERNAL_PREVIEW_SERVER_LOCATION: previewServerLocation,
    REACT_EMAIL_INTERNAL_USER_PROJECT_LOCATION: cwd,
    REACT_EMAIL_INTERNAL_RESEND_API_KEY: resendApiKey,
    // Only spread the key when set so a user-provided env var isn't clobbered.
    ...(compatibilityClients !== undefined && {
      COMPATIBILITY_EMAIL_CLIENTS: compatibilityClients,
    }),
  } as const;
};
