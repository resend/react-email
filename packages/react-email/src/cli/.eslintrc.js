const { resolve } = require("node:path");

const project = resolve(process.cwd(), "../../tsconfig.json");

module.exports = {
  extends: ['custom/react-internal'],
  parserOptions: {
    project
  },
  rules: {
    'eslint-comments/require-description': 'off',
    'no-console': 'off',
  },
};
