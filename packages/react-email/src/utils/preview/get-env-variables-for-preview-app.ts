import path from 'node:path';

export const getEnvVariablesForPreviewApp = (
  relativePathToEmailsDirectory: string,
  previewServerLocation: string,
  cwd: string,
  resendApiKey?: string,
) => {
  return {
    __REACT_EMAIL_INTERNAL_EMAILS_DIR_RELATIVE_PATH:
      relativePathToEmailsDirectory,
    __REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH: path.resolve(
      cwd,
      relativePathToEmailsDirectory,
    ),
    __REACT_EMAIL_INTERNAL_PREVIEW_SERVER_LOCATION: previewServerLocation,
    __REACT_EMAIL_INTERNAL_USER_PROJECT_LOCATION: cwd,
    __REACT_EMAIL_INTERNAL_RESEND_API_KEY: resendApiKey,
  } as const;
};
