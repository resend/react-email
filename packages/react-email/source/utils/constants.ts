import os from 'os';
import path from 'path';

// Package variables
export const DEFAULT_EMAILS_DIRECTORY = 'emails';
export const PACKAGE_NAME = 'create-react-email-test';

// Default paths
export const CURRENT_PATH = process.cwd();
export const HOME_DIR = os.homedir();

// Client paths
export const CLIENT_PACKAGE_JSON = `${CURRENT_PATH}/package.json`;

// React email paths
export const REACT_EMAIL_ROOT = path.join(HOME_DIR, '.react-email');

// Events
export const EVENT_FILE_DELETED = 'unlink';

export const NODE_MODULES_PACKAGE_PATH = path.join(
  CURRENT_PATH,
  'node_modules',
  PACKAGE_NAME,
);
export const NODE_MODULES_PREVIEW_PATH = path.join(
  NODE_MODULES_PACKAGE_PATH,
  'preview',
);

export const CLIENT_EMAILS_PATH = path.join(
  CURRENT_PATH,
  DEFAULT_EMAILS_DIRECTORY,
);
export const PACKAGE_EMAILS_PATH = path.join(
  REACT_EMAIL_ROOT,
  DEFAULT_EMAILS_DIRECTORY,
);
