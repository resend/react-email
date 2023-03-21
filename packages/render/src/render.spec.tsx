import * as React from "react";
import { render } from "./index";
import { Template } from "./utils/template";
import { Preview } from "./utils/preview";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("converts a React component into HTML", () => {
    const actualOutput = render(<Template firstName="Jim" />);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><h1>Welcome, Jim!</h1><img src=\\"img/test.png\\" alt=\\"test\\"/><p>Thanks for trying our product. We&#x27;re thrilled to have you on board!</p>"`
    );
  });

  it("converts a React component into PlainText", () => {
    const actualOutput = render(<Template firstName="Jim" />, {
      plainText: true,
    });
    expect(actualOutput).toMatchInlineSnapshot(`
      "WELCOME, JIM!

      Thanks for trying our product. We're thrilled to have you on board!"
    `);
  });

  it("converts to plain text and removes reserved ID", () => {
    const actualOutput = render(<Preview />, {
      plainText: true,
    });
    expect(actualOutput).toMatchInlineSnapshot(
      `"THIS SHOULD BE RENDERED IN PLAIN TEXT"`
    );
  });
});
