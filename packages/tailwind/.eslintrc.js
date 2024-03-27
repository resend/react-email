/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ["custom/react-internal"],
  ignorePatterns: ["integrations/**/*"],
  plugins: [
    /* just a plugin to create custom linting rules with regex */
    "regex"
  ],
  rules: {
    "regex/invalid": [
      "error", [
        {
          "message": "Do not use negative look behinds as they may harm experience for some users (see https://github.com/resend/react-email/issues/549)",
          "regex": "\\(\\?<![^\)]*\\)",
        },
        {
          "message": "Do not use look behinds as they may harm experience for some users (see https://github.com/resend/react-email/issues/549)",
          "regex": "\\(\\?<=[^\\)]*\\)"
        }
      ]
    ]
  },
};
