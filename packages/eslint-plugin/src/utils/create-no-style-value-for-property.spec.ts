import tester from "../../testing-utils/vitest-rule-tester";
import { noCssFlexWrap } from "../rules";

describe("rules that use createNoStyleValueForProperty", () => {
  tester.run("no-css-flex-wrap", noCssFlexWrap, {
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
      {
        code: '<Tailwind><div className="flex-wrap"/></Tailwind>',
        errors: [
          {
            line: 1,
            column: 27,
            messageId: "not-supported-on-most-email-clients",
          },
        ],
      },
      {
        code: `
      const Div = <div style={styles.flexWrap} />;
      const styles = {
        flexWrap: {
          flexWrap: "wrap"
        }
      }
      `,
        errors: [
          {
            line: 5,
            column: 11,
            messageId: "not-supported-on-most-email-clients",
            data: {
              value: '"100vmin"',
            },
          },
        ],
      },
    ],
    valid: [],
  });
});
