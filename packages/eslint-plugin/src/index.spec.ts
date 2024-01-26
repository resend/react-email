import { RuleTester } from "@typescript-eslint/rule-tester";
import { noCssAccentColor, noCssFlexWrap } from "./rules";

// If you are not using vitest with globals: true (https://vitest.dev/config/#globals):
RuleTester.afterAll = afterAll;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.describe = describe;

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run("no-css-accent-color", noCssAccentColor, {
  invalid: [
    {
      code: '<div style={{ accentColor: "#fff" }} />',
      errors: [
        {
          line: 1,
          column: 15,
          messageId: "not-supported-on-most-email-clients",
          data: {
            property: "accentColor",
          },
        },
      ],
    },
    {
      code: '<div className="accent-white" />',
      errors: [
        {
          line: 1,
          column: 17,
          messageId: "not-supported-on-most-email-clients",
          data: {
            property: "accentColor",
          },
        },
      ],
    },
    {
      code: `
      const Div = <div style={styles.accentWhite} />;
      const styles = {
        accentWhite: {
          accentColor: "#fff"
        }
      }
      `,
      errors: [
        {
          line: 5,
          column: 11,
          messageId: "not-supported-on-most-email-clients",
          data: {
            property: "accentColor",
          },
        },
      ],
    },
  ],
  valid: [
    {
      code: '<div style={{ color: "#fff" }} />',
    },
  ],
});

ruleTester.run("no-css-flex-wrap", noCssFlexWrap, {
  invalid: [
    {
      code: '<div style={{ flexWrap: "wrap" }} />',
      errors: [
        {
          line: 1,
          column: 15,
          messageId: "not-supported-on-most-email-clients",
        },
      ],
    },
  ],
  valid: [
    {
      code: "<div style={{ flexWrap: undefined }} />",
    },
  ],
});
