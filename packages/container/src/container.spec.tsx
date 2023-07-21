import * as React from "react";
import { Container } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Container> component", () => {
    const container = render(
      <Container style={{ maxWidth: "300px" }}>
        <button>Hi</button>
      </Container>,
    );

    expect(container).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><table align=\\"center\\" width=\\"100%\\" data-id=\\"__react-email-container\\" role=\\"presentation\\" cellSpacing=\\"0\\" cellPadding=\\"0\\" border=\\"0\\" style=\\"max-width:300px\\"><tbody><tr style=\\"width:100%\\"><td><button>Hi</button></td></tr></tbody></table>"`,
    );
  });
});
