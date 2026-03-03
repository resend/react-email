import fs from 'node:fs';
import { setupHotreloading, startDevServer } from '../utils/index.js';
import { loadReactEmailConfig } from '../utils/load-config.js';

interface Args {
  dir?: string;
  port?: string;
}

const DEFAULT_PORT = 3000;
const MAX_PORT = 65_535;

function parsePort(value: string | number | undefined): number {
  if (value === undefined) return DEFAULT_PORT;
  const n =
    typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isInteger(n) || n < 0 || n > MAX_PORT) return DEFAULT_PORT;
  return n;
}

export const dev = async ({ dir: cliDir, port: cliPort }: Args) => {
  try {
    const projectRoot = process.cwd();
    const config = await loadReactEmailConfig(projectRoot);
    const hasConfig = typeof config !== 'undefined';
    const emailsDirRelativePath = cliDir ?? config?.emailsDir ?? './emails';
    const port = parsePort(cliPort ?? config?.preview?.port ?? DEFAULT_PORT);
    if (
      !hasConfig &&
      typeof cliDir === 'undefined' &&
      typeof cliPort === 'undefined'
    ) {
      console.log(
        '[react-email] No react-email.config.* found. Using defaults ("./emails", port 3000).',
      );
      console.log(
        '[react-email] Run "npx react-email init" to create a config file.',
      );
    }

    if (!fs.existsSync(emailsDirRelativePath)) {
      console.error(`Missing ${emailsDirRelativePath} folder`);
      process.exit(1);
    }

    const devServer = await startDevServer(
      emailsDirRelativePath,
      emailsDirRelativePath, // defaults to ./emails/static for the static files that are served to the preview
      port,
    );

    await setupHotreloading(devServer, emailsDirRelativePath);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
