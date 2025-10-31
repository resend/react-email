/** ONLY ACCESSIBLE ON THE SERVER */
export const userProjectLocation = process.env.USER_PROJECT_LOCATION!;

/** ONLY ACCESSIBLE ON THE SERVER */
export const previewServerLocation = process.env.PREVIEW_SERVER_LOCATION!;

/** ONLY ACCESSIBLE ON THE SERVER */
export const emailsDirectoryAbsolutePath =
  process.env.EMAILS_DIR_ABSOLUTE_PATH!;

export const isBuilding = process.env.NEXT_PUBLIC_IS_BUILDING === 'true';

export const isPreviewDevelopment =
  process.env.NEXT_PUBLIC_IS_PREVIEW_DEVELOPMENT === 'true';
