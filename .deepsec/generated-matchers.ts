import { compileDeclarativeMatchers, type DeepsecPlugin } from "deepsec/config";

export const generatedMatchersPlugin: DeepsecPlugin = {
  name: "deepsec-generated-matchers",
  matchers: compileDeclarativeMatchers([]),
};
