import path from 'node:path';

export const getEnvVariablesForPreviewApp = (
  relativePathToEmailsDirectory: string,
  previewServerLocation: string,
  cwd: string,
  resendApiKey?: string,
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
  } as const;
};
