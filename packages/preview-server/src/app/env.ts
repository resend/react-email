import { resolvePreviewEmailsDir } from '../utils/load-preview-config';

/** ONLY ACCESSIBLE ON THE SERVER */
export const userProjectLocation =
  process.env.REACT_EMAIL_INTERNAL_USER_PROJECT_LOCATION ?? process.cwd();

/** ONLY ACCESSIBLE ON THE SERVER */
export const previewServerLocation =
  process.env.REACT_EMAIL_INTERNAL_PREVIEW_SERVER_LOCATION ?? process.cwd();

const resolvedEmailsDirectoryAbsolutePath = await (async () => {
  if (process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH) {
    return process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH;
  }
  return resolvePreviewEmailsDir(userProjectLocation);
})();

if (!resolvedEmailsDirectoryAbsolutePath) {
  throw new Error(
    '[react-email] Could not determine the emails directory.\n' +
      'Either set REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH or add an ' +
      '`emailsDir` field to your react-email.config.* file.',
  );
}

/** ONLY ACCESSIBLE ON THE SERVER */
export const emailsDirectoryAbsolutePath = resolvedEmailsDirectoryAbsolutePath;

/** ONLY ACCESSIBLE ON THE SERVER */
export const resendApiKey = process.env.REACT_EMAIL_INTERNAL_RESEND_API_KEY;

export const isBuilding = process.env.NEXT_PUBLIC_IS_BUILDING === 'true';

export const isPreviewDevelopment =
  process.env.NEXT_PUBLIC_IS_PREVIEW_DEVELOPMENT === 'true';
