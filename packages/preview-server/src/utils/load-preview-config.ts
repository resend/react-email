import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * mirrors the ReactEmailConfig shape from the `react-email` CLI package.
 */
export interface ReactEmailConfig {
  emailsDir?: string;
  preview?: {
    port?: number;
    emailsDir?: string;
  };
}

const REACT_EMAIL_CONFIG_FILES = [
  'react-email.config.mjs',
  'react-email.config.cjs',
  'react-email.config.js',
  'react-email.config.json',
] as const;

type ReactEmailConfigFile = (typeof REACT_EMAIL_CONFIG_FILES)[number];

const loadConfigModule = async (
  filePath: string,
): Promise<ReactEmailConfig | undefined> => {
  if (filePath.endsWith('.json')) {
    const contents = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(contents) as ReactEmailConfig;
  }

  const mod = (await import(
    /* @vite-ignore */ pathToFileURL(filePath).href
  )) as { default?: ReactEmailConfig } & ReactEmailConfig;

  if ('default' in mod && mod.default) {
    return mod.default;
  }

  return mod as ReactEmailConfig;
};

export const loadReactEmailConfig = async (
  projectRoot: string,
): Promise<ReactEmailConfig | undefined> => {
  for (const filename of REACT_EMAIL_CONFIG_FILES) {
    const candidatePath = path.resolve(
      projectRoot,
      filename as ReactEmailConfigFile,
    );
    if (!fs.existsSync(candidatePath)) continue;

    try {
      return await loadConfigModule(candidatePath);
    } catch (exception) {
      console.warn(
        `[react-email] Failed to load config at ${candidatePath}. Falling back to environment defaults.\n`,
        exception,
      );
      return undefined;
    }
  }

  return undefined;
};

export const resolvePreviewEmailsDir = async (
  projectRoot: string,
): Promise<string | undefined> => {
  const config = await loadReactEmailConfig(projectRoot);
  if (!config) return undefined;

  const relative = config.preview?.emailsDir ?? config.emailsDir;
  return relative ? path.resolve(projectRoot, relative) : undefined;
};
