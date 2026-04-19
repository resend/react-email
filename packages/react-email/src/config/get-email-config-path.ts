import fs from 'node:fs';
import path from 'node:path';

const supportedEmailConfigFilenames = [
  'email.config.ts',
  'email.config.mts',
  'email.config.js',
  'email.config.mjs',
  'email.config.cjs',
];

export const getEmailConfigPath = (userProjectLocation: string) => {
  for (const filename of supportedEmailConfigFilenames) {
    const emailConfigPath = path.join(userProjectLocation, filename);

    if (fs.existsSync(emailConfigPath)) {
      return emailConfigPath;
    }
  }
};
