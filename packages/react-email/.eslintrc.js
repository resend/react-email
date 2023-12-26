/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ['custom/next'],
  ignorePatterns: ['cli/index.js'],
  rules: {
    'eslint-comments/require-description': 'off',
    'no-console': 'off',
  },
};
