import tester from "../../testing-utils/vitest-rule-tester";
import { noCssAccentColor } from "../rules";

describe("rules that use createNoStylePropertyRule", () => {
  tester.run("no-css-accent-color", noCssAccentColor, {
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
        code: '<Tailwind><div className="accent-white" /></Tailwind>',
        errors: [
          {
            line: 1,
            column: 27,
            messageId: "not-supported-on-most-email-clients",
            data: {
              property: "accent-white",
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
    valid: [],
  });
});
