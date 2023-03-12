import path from 'path';

// Package variables
export const DEFAULT_EMAILS_DIRECTORY = 'emails';
export const PACKAGE_NAME = 'react-email';

// Default paths
export const CURRENT_PATH = process.cwd();

// User paths
export const USER_PACKAGE_JSON = path.join(CURRENT_PATH, 'package.json');

// React Email paths
export const REACT_EMAIL_ROOT = path.join(CURRENT_PATH, '.react-email');
export const SRC_PATH = path.join(REACT_EMAIL_ROOT, 'src');
export const PUBLIC_PATH = path.join(REACT_EMAIL_ROOT, 'public');

// Events
export const EVENT_FILE_DELETED = 'unlink';

export const PACKAGE_EMAILS_PATH = path.join(
  REACT_EMAIL_ROOT,
  DEFAULT_EMAILS_DIRECTORY,
);
