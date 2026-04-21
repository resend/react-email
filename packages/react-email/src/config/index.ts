import type { Plugin } from 'esbuild';

export interface EmailConfig {
  esbuild?: {
    plugins?: Plugin[];
  };
}

export const defineConfig = <T extends EmailConfig>(config: T) => config;

export * from './get-email-config.js';
export * from './get-email-config-path.js';
