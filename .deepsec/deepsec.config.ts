import { defineConfig } from "deepsec/config";
import { generatedMatchersPlugin } from "./generated-matchers.js";

export default defineConfig({
  projects: [
    { id: "react-email", root: ".." },
    // <deepsec:projects-insert-above>
  ],
  plugins: [generatedMatchersPlugin],
});
