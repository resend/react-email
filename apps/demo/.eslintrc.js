const project = require('path').resolve(process.cwd(), "tsconfig.json");

module.exports = {
  "parser": "@typescript-eslint/parser",
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
};
