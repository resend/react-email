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
    expect(actualOutput).toMatchSnapshot();
  });

  it("converts a React component into PlainText", () => {
    const actualOutput = render(<Template firstName="Jim" />, {
      plainText: true,
    });
    expect(actualOutput).toMatchSnapshot();
  });

  it("converts to plain text and removes reserved ID", () => {
    const actualOutput = render(<Preview />, {
      plainText: true,
    });
    expect(actualOutput).toMatchSnapshot();
  });
});
