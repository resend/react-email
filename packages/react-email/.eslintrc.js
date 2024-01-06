const { resolve } = require('node:path');

const project = resolve(__dirname, './tsconfig.json');

/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ['custom/next'],
  ignorePatterns: ['cli/index.js'],
  parserOptions: {
    project,
  },
  rules: {
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'turbo/no-undeclared-env-vars': 'off',
    'eslint-comments/require-description': 'off',
    'no-console': 'off',
  },
};
