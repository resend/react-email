import tester from "../../testing-utils/vitest-rule-tester";
import { noCssUnitVmin } from "../rules";

describe("rules that use createNoStylePropertyRule", () => {
  tester.run("no-css-unit-vmin", noCssUnitVmin, {
    invalid: [
      {
        code: '<div style={{ width: "100vmin" }} />',
        errors: [
          {
            line: 1,
            column: 15,
            messageId: "not-supported-on-most-email-clients",
            data: {
              value: '"100vmin"',
            },
          },
        ],
      },
      {
        code: '<Tailwind><div className="w-[100vmin]" /></Tailwind>',
        errors: [
          {
            line: 1,
            column: 27,
            messageId: "not-supported-on-most-email-clients",
            data: {
              value: "w-[100vmin]",
            },
          },
        ],
      },
      {
        code: `
      const Div = <div style={styles.widthStyle} />;
      const styles = {
        widthStyle: {
          width: "100vmin"
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
