import path from 'path';

// Package variables
export const DEFAULT_EMAILS_DIRECTORY = 'emails';
export const PACKAGE_NAME = 'react-email';

// Default paths
export const CURRENT_PATH = process.cwd();

// Client paths
export const CLIENT_PACKAGE_JSON = `${CURRENT_PATH}/package.json`;

// React Email paths
export const REACT_EMAIL_ROOT = path.join(CURRENT_PATH, '.react-email');
export const SRC_PATH = path.join(REACT_EMAIL_ROOT, 'src');
export const PUBLIC_PATH = path.join(REACT_EMAIL_ROOT, 'public');

// Events
export const EVENT_FILE_DELETED = 'unlink';

export const CLIENT_EMAILS_PATH = path.join(
  CURRENT_PATH,
  DEFAULT_EMAILS_DIRECTORY,
);
export const PACKAGE_EMAILS_PATH = path.join(
  REACT_EMAIL_ROOT,
  DEFAULT_EMAILS_DIRECTORY,
);
