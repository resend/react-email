import { RuleTester } from "@typescript-eslint/rule-tester";

class VitestRuleTester extends RuleTester { }

export default new VitestRuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

VitestRuleTester.it = it;
VitestRuleTester.itOnly = it.only;
VitestRuleTester.itSkip = it.skip;
VitestRuleTester.describe = describe;
VitestRuleTester.describeSkip = describe.skip;

