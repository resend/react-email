/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ['custom/next'],
  ignorePatterns: ['cli/index.js'],
  rules: {
    'turbo/no-undeclared-env-vars': 'off',
    'eslint-comments/require-description': 'off',
    'no-console': 'off',
  },
};
