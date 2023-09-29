import path from 'path';

// Package variables
export const DEFAULT_EMAILS_DIRECTORY = 'emails';
export const PACKAGE_NAME = 'react-email';

// Default paths
export const CURRENT_PATH = process.cwd();

// User paths
export const USER_PACKAGE_JSON = path.join(CURRENT_PATH, 'package.json');
export const USER_STATIC_FILES = path.join(CURRENT_PATH, 'emails', 'static');

// Events
export const EVENT_FILE_DELETED = 'unlink';
