/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const emailsDirRelativePath =
  process.env.NEXT_PUBLIC_EMAILS_DIR_RELATIVE_PATH ?? 'emails';

export const userProjectLocation =
  process.env.NEXT_PUBLIC_USER_PROJECT_LOCATION!;

// this trickery to find the path separator for the OS is for this to work both on the client
// and on the server properly
export const pathSeparator = process.env.NEXT_PUBLIC_OS_PATH_SEPARATOR! as
  | '/'
  | '\\';

export const normalizePath = (path: string) => {
  let newPath = path;

  while (newPath.startsWith(`.${pathSeparator}`)) {
    newPath = newPath.slice(2);
  }

  while (newPath.startsWith(pathSeparator)) {
    newPath = newPath.slice(1);
  }

  while (newPath.endsWith(pathSeparator)) {
    newPath = newPath.slice(0, -1);
  }

  return newPath;
};

export const emailsDirectoryAbsolutePath = `${
  process.env.NEXT_PUBLIC_USER_PROJECT_LOCATION
}${pathSeparator}${normalizePath(emailsDirRelativePath)}`;
