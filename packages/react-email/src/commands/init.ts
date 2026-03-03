import fs from 'node:fs';
import path from 'node:path';
import type { ReactEmailConfig } from '../utils/load-config.js';

const DEFAULT_CONFIG: ReactEmailConfig = {
  emailsDir: './emails',
  preview: {
    port: 3000,
  },
};

const CONFIG_FILENAMES = [
  'react-email.config.mjs',
  'react-email.config.cjs',
  'react-email.config.js',
  'react-email.config.json',
] as const;

const hasExistingConfig = (root: string) =>
  CONFIG_FILENAMES.some((name) => fs.existsSync(path.resolve(root, name)));

interface InitArgs {
  force?: boolean;
  projectRoot?: string;
}

export const init = async ({
  force = false,
  projectRoot = process.cwd(),
}: InitArgs = {}) => {
  const root = path.resolve(projectRoot);

  if (!force && hasExistingConfig(root)) {
    console.log(
      '[react-email] A react-email.config file already exists. ' +
        'Run with --force to overwrite.',
    );
    return;
  }

  const configPath = path.resolve(root, 'react-email.config.json');
  fs.writeFileSync(
    configPath,
    `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`,
    'utf8',
  );
  console.log(`[react-email] Created ${path.relative(root, configPath)}`);
};
