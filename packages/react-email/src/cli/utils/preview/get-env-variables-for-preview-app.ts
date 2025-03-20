import path from 'node:path';
import { isDev } from './start-dev-server';

export const getEnvVariablesForPreviewApp = (
  relativePathToEmailsDirectory: string,
  cwd: string,
) => {
  return {
    EMAILS_DIR_RELATIVE_PATH: relativePathToEmailsDirectory,
    EMAILS_DIR_ABSOLUTE_PATH: path.resolve(cwd, relativePathToEmailsDirectory),
    USER_PROJECT_LOCATION: cwd,
    NEXT_PUBLIC_IS_PREVIEW_DEVELOPMENT: isDev ? 'true' : 'false',
  } as const;
};
