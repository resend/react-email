import { Template } from "./utils/template";
import { Preview } from "./utils/preview";
import { render } from "./index";

describe("render", () => {
  it("converts a React component into HTML", async () => {
    const actualOutput = await render(<Template firstName="Jim" />);
    expect(actualOutput).toMatchInlineSnapshot();
  });

  it("converts a React component into PlainText", async () => {
    const actualOutput = await render(<Template firstName="Jim" />, {
      plainText: true,
    });
    expect(actualOutput).toMatchInlineSnapshot(`
      "WELCOME, JIM!

      Thanks for trying our product. We're thrilled to have you on board!"
    `);
  });

  it("converts to plain text and removes reserved ID", async () => {
    const actualOutput = await render(<Preview />, {
      plainText: true,
    });
    expect(actualOutput).toMatchInlineSnapshot(
      '"THIS SHOULD BE RENDERED IN PLAIN TEXT"',
    );
  });
});
