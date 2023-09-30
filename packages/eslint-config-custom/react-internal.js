const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
  ]
    .map(require.resolve)
    .concat(["eslint-config-prettier"]),
  parserOptions: {
    project,
  },
  env: {
    node: true,
  },
  globals: {
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/no-unescaped-entities": "off",
    "import/no-default-export": "off",
    "import/no-named-as-default-member": "off",
    "prefer-named-capture-group": "off",
    "eslint-comments/require-description": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
  },
};
