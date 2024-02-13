module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  ignorePatterns: ["templates/*"],
  extends: ["custom/react-internal"],
  rules: {
    "no-console": "off"
  }
};
