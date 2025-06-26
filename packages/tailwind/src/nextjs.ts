import type { TransformOptions } from '@babel/core';
import type { NextConfig } from 'next';
import type { WebpackConfigContext } from 'next/dist/server/config-shared';
import type { Configuration } from 'webpack';
import babelPlugin from './babel';

export default function withTailwindcss(
  config: NextConfig,
  emailsDirectory = 'emails',
): Record<string, any> {
  return {
    ...config,
    webpack(baseWebpackConfig: Configuration, context: WebpackConfigContext) {
      const webpackConfig: Configuration =
        config.webpack?.(baseWebpackConfig, context) ?? baseWebpackConfig;
      webpackConfig.module ??= { rules: [] };
      webpackConfig.module.rules ??= [];
      webpackConfig.module.rules.push({
        loader: 'babel-loader',
        include: (value) => {
          return new RegExp(`${emailsDirectory}\/.+?\.(tsx|jsx|js)$`).test(
            value,
          );
        },
        options: {
          targets: 'defaults',
          presets: ['@babel/preset-typescript', '@babel/preset-react'],
          plugins: [babelPlugin({})],
        } satisfies TransformOptions,
      });
      return config;
    },
  };
}
