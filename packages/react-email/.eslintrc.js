/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ['custom/next'],
  ignorePatterns: ['cli/index.js'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'turbo/no-undeclared-env-vars': 'off',
    'eslint-comments/require-description': 'off',
    'no-console': 'off',
  },
};
