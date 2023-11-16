import { ESLint } from "eslint";

import noBase64Images from "./rules/no-base64-images";

export default {
  rules: {
    "no-base64-image": noBase64Images,
  },
} satisfies ESLint.Plugin;
