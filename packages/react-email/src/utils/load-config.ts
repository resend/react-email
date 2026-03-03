import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export interface ReactEmailPreviewConfig {
  port?: number;
  emailsDir?: string;
}

export interface ReactEmailConfig {
  emailsDir?: string;
  preview?: ReactEmailPreviewConfig;
}

export const defineConfig = (config: ReactEmailConfig): ReactEmailConfig =>
  config;

function validateReactEmailConfig(raw: unknown): ReactEmailConfig | undefined {
  if (raw === null || typeof raw !== 'object') return undefined;
  const o = raw as Record<string, unknown>;
  const result: ReactEmailConfig = {};
  if (typeof o.emailsDir === 'string' && o.emailsDir.length > 0) {
    result.emailsDir = o.emailsDir;
  }
  if (o.preview !== null && typeof o.preview === 'object') {
    const prev = o.preview as Record<string, unknown>;
    result.preview = {};
    if (
      typeof prev.port === 'number' &&
      Number.isInteger(prev.port) &&
      prev.port >= 1 &&
      prev.port <= 65_535
    ) {
      result.preview.port = prev.port;
    }
    if (typeof prev.emailsDir === 'string' && prev.emailsDir.length > 0) {
      result.preview.emailsDir = prev.emailsDir;
    }
  }
  return result;
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
    let parsed: unknown;
    try {
      const contents = await fs.promises.readFile(filePath, 'utf8');
      parsed = JSON.parse(contents);
    } catch {
      return undefined;
    }
    return validateReactEmailConfig(parsed);
  }

  const mod = (await import(
    /* @vite-ignore */ pathToFileURL(filePath).href
  )) as { default?: unknown } & Record<string, unknown>;

  const raw = mod.default ?? mod;
  return validateReactEmailConfig(raw);
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
