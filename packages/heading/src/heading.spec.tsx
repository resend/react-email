import { Heading } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Heading> component", () => {
    const actualOutput = render(
      <Heading mx="4" as="h2">
        Lorem ipsum
      </Heading>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><h2 data-id=\\"react-email-heading\\" style=\\"margin-left:4px;margin-right:4px\\">Lorem ipsum</h2>"`,
    );
  });
});
