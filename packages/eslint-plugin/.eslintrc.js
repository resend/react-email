/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ["custom/library"],
  ignorePatterns: ['codegen/caniemail'],
  rules: {
    "import/no-default-export": "off",
    "no-console": "off"
  },
};
