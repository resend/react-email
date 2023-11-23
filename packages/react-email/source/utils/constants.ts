import path from 'node:path';
import os from 'node:os';

// Package variables
export const DEFAULT_EMAILS_DIRECTORY = 'emails';
export const PACKAGE_NAME = 'react-email';

// Default paths
export const CURRENT_PATH = process.cwd();

// User paths
export const USER_PACKAGE_JSON = path.join(CURRENT_PATH, 'package.json');
export const USER_STATIC_FILES = path.join(CURRENT_PATH, 'emails', 'static');

export const TEMP_DIR = path.join(os.tmpdir(), 'react-email');

// React Email paths
export const PREVIEW_CLIENT_DIR = path.join(TEMP_DIR, 'preview-client');

// Events
export const EVENT_FILE_DELETED = 'unlink';

export const PREVIEW_CLIENT_EMAILS_PATH = path.join(
  PREVIEW_CLIENT_DIR,
  DEFAULT_EMAILS_DIRECTORY,
);

export const PREVIEW_CLIENT_PUBLIC_PATH = path.join(
  PREVIEW_CLIENT_DIR,
  'public',
);
