import { format } from 'prettier/standalone';
import html from 'prettier/plugins/html';
import type { Options } from 'prettier';

const defaults: Options = {
  endOfLine: 'lf',
  tabWidth: 2,
  plugins: [html],
  parser: 'html',
};

export const pretty = (str: string, options: Options = {}) => {
  return format(str, {
    ...defaults,
    ...options,
  });
};
