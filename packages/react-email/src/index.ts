#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { program } from 'commander';
import { build } from './commands/build.js';
import { dev } from './commands/dev.js';
import { exportTemplates } from './commands/export.js';
import { init } from './commands/init.js';
import { resendReset } from './commands/resend/reset.js';
import { resendSetup } from './commands/resend/setup.js';
import { start } from './commands/start.js';
import { packageJson } from './utils/packageJson.js';

export type {
  ReactEmailConfig,
  ReactEmailPreviewConfig,
} from './utils/load-config.js';
export { defineConfig } from './utils/load-config.js';

const isRunAsEntryPoint = (): boolean => {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    const thisFile = fs.realpathSync(fileURLToPath(import.meta.url));
    const entryFile = fs.realpathSync(entry);
    return thisFile === entryFile;
  } catch {
    return false;
  }
};

const requiredFlags = [
  '--experimental-vm-modules',
  '--disable-warning=ExperimentalWarning',
];

const hasRequiredFlags = requiredFlags.every((flag) =>
  process.execArgv.includes(flag),
);

if (!isRunAsEntryPoint()) {
} else if (!hasRequiredFlags) {
  const child = spawn(
    process.execPath,
    [
      ...requiredFlags,
      ...process.execArgv,
      process.argv[1] ?? '',
      ...process.argv.slice(2),
    ],
    { stdio: 'inherit' },
  );

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
} else {
  const PACKAGE_NAME = 'react-email';

  program
    .name(PACKAGE_NAME)
    .description('A live preview of your emails right in your browser')
    .version(packageJson.version);

  program
    .command('dev')
    .description('Starts the preview email development app')
    .option(
      '-d, --dir <path>',
      'Directory with your email templates (defaults to "./emails" or the value from react-email.config.*)',
    )
    .option(
      '-p --port <port>',
      'Port to run dev server on (defaults to 3000 or the value from react-email.config.*)',
    )
    .action(dev);

  program
    .command('build')
    .description('Copies the preview app for onto .react-email and builds it')
    .option(
      '-d, --dir <path>',
      'Directory with your email templates (defaults to "./emails" or the value from react-email.config.*)',
    )
    .option(
      '-p --packageManager <name>',
      'Package name to use on installation on `.react-email`',
      'npm',
    )
    .action(build);

  program
    .command('start')
    .description('Runs the built preview app that is inside of ".react-email"')
    .action(start);

  program
    .command('init')
    .description(
      'Creates a react-email.config.json in the project root with sensible defaults',
    )
    .option('-f, --force', 'Overwrite existing config files', false)
    .action(init);

  program
    .command('export')
    .description('Build the templates to the `out` directory')
    .option('--outDir <path>', 'Output directory', 'out')
    .option('-p, --pretty', 'Pretty print the output', false)
    .option('-t, --plainText', 'Set output format as plain text', false)
    .option(
      '-d, --dir <path>',
      'Directory with your email templates (defaults to "./emails" or the value from react-email.config.*)',
    )
    .option(
      '-s, --silent',
      'To, or not to show a spinner with process information',
      false,
    )
    .action(async ({ outDir, pretty, plainText, silent, dir }) => {
      const { loadReactEmailConfig } = await import('./utils/load-config.js');

      const projectRoot = process.cwd();
      const config = await loadReactEmailConfig(projectRoot);

      const emailsDirRelativePath = dir ?? config?.emailsDir ?? './emails';

      await exportTemplates(outDir, emailsDirRelativePath, {
        silent,
        plainText,
        pretty,
      });
    });

  const resend = program.command('resend');

  resend
    .command('setup')
    .description(
      'Sets up the integration between the React Email CLI, and your Resend account through an API Key',
    )
    .action(resendSetup);

  resend
    .command('reset')
    .description('Deletes your API Key from the React Email configuration')
    .action(resendReset);

  program.parse();
}
