import path from 'path';

export const getEnvVariablesForPreviewApp = (
  relativePathToEmailsDirectory: string,
  cliPackageLocation: string,
  cwd: string,
) => {
  return {
    NEXT_PUBLIC_EMAILS_DIR_RELATIVE_PATH: relativePathToEmailsDirectory,
    NEXT_PUBLIC_CLI_PACKAGE_LOCATION: cliPackageLocation,
    NEXT_PUBLIC_OS_PATH_SEPARATOR: path.sep,
    NEXT_PUBLIC_USER_PROJECT_LOCATION: cwd,
  } as const;
};
