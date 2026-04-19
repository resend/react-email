import { createJiti } from 'jiti';
import type { EmailConfig } from './index.js';

export const getEmailConfig = async (
  emailConfigPath?: string,
): Promise<EmailConfig> => {
  if (!emailConfigPath) {
    return {};
  }

  let emailConfig: EmailConfig;
  try {
    const jiti = createJiti(emailConfigPath);
    emailConfig = await jiti.import(emailConfigPath, { default: true });
  } catch (exception) {
    throw new Error(
      `Failed to load React Email config at ${emailConfigPath}.`,
      { cause: exception },
    );
  }

  if (!emailConfig || typeof emailConfig !== 'object') {
    throw new Error(
      `Expected React Email config at ${emailConfigPath} to export an object.`,
    );
  }

  const plugins = emailConfig.esbuild?.plugins;

  if (typeof plugins !== 'undefined' && !Array.isArray(plugins)) {
    throw new Error(
      `Expected "esbuild.plugins" in React Email config at ${emailConfigPath} to be an array.`,
    );
  }

  return emailConfig;
};
