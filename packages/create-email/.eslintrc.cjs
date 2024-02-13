module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  ignorePatterns: ["templates/*"],
  extends: ["custom/react-internal"],
};
