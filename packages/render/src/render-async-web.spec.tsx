/**
 * @vitest-environment jsdom
 */

import { Template } from "./utils/template";
import { Preview } from "./utils/preview";
import { renderAsync } from "./render-async";

describe("renderAsync on the browser environment", () => {
  beforeEach(() => {
    vi.mock(
      "react-dom/server",
      // @ts-expect-error no type defs is an error thrown here that doesn't really matter
      (_importOriginal) => import("react-dom/server.browser"),
    );
    // need this mock because this is the file that is exported as the browser
    // version of react-dom/server this is necessary which is the only one that has
    // renderToReadableStream implemented
  });

  it("converts a React component into HTML with Next 14 error stubs", async () => {
    vi.mock("react-dom/server", async (_importOriginal) => {
      const ReactDOMServerBrowser = await import("react-dom/server");
      const ERROR_MESSAGE =
        "Internal Error: do not use legacy react-dom/server APIs. If you encountered this error, please open an issue on the Next.js repo.";

      return {
        ...ReactDOMServerBrowser,
        default: {
          ...ReactDOMServerBrowser.default,
          renderToString() {
            throw new Error(ERROR_MESSAGE);
          },
          renderToStaticMarkup() {
            throw new Error(ERROR_MESSAGE);
          },
        },
        renderToString() {
          throw new Error(ERROR_MESSAGE);
        },
        renderToStaticMarkup() {
          throw new Error(ERROR_MESSAGE);
        },
      };
    });

    const actualOutput = await renderAsync(<Template firstName="Jim" />);

    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><h1>Welcome, <!-- -->Jim<!-- -->!</h1><img alt=\\"test\\" src=\\"img/test.png\\"/><p>Thanks for trying our product. We&#x27;re thrilled to have you on board!</p>"',
    );

    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("converts a React component into HTML", async () => {
    const actualOutput = await renderAsync(<Template firstName="Jim" />);

    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><h1>Welcome, <!-- -->Jim<!-- -->!</h1><img alt=\\"test\\" src=\\"img/test.png\\"/><p>Thanks for trying our product. We&#x27;re thrilled to have you on board!</p>"',
    );
  });

  it("converts a React component into PlainText", async () => {
    const actualOutput = await renderAsync(<Template firstName="Jim" />, {
      plainText: true,
    });

    expect(actualOutput).toMatchInlineSnapshot(`
      "WELCOME, JIM!

      Thanks for trying our product. We're thrilled to have you on board!"
    `);
  });

  it("converts to plain text and removes reserved ID", async () => {
    const actualOutput = await renderAsync(<Preview />, {
      plainText: true,
    });

    expect(actualOutput).toMatchInlineSnapshot(
      `"THIS SHOULD BE RENDERED IN PLAIN TEXT"`,
    );
  });
});
