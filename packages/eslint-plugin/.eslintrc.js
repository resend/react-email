/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ["custom/library"],
  ignorePatterns: ['codegen/caniemail'],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "eslint-comments/require-description": "off",
    "import/no-default-export": "off",
    "no-console": "off"
  },
};
