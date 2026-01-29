/** ONLY ACCESSIBLE ON THE SERVER */
export const userProjectLocation = process.env.__REACT_EMAIL_INTERNAL_USER_PROJECT_LOCATION!;

/** ONLY ACCESSIBLE ON THE SERVER */
export const previewServerLocation = process.env.__REACT_EMAIL_INTERNAL_PREVIEW_SERVER_LOCATION!;

/** ONLY ACCESSIBLE ON THE SERVER */
export const emailsDirectoryAbsolutePath =
  process.env.__REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH!;

/** ONLY ACCESSIBLE ON THE SERVER */
export const resendApiKey = process.env.__REACT_EMAIL_INTERNAL_RESEND_API_KEY;

export const isBuilding = process.env.NEXT_PUBLIC_IS_BUILDING === 'true';

export const isPreviewDevelopment =
  process.env.NEXT_PUBLIC_IS_PREVIEW_DEVELOPMENT === 'true';
