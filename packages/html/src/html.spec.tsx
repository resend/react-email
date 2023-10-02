import { render } from "@react-email/render";
import { Html } from "./index";

describe("render", () => {
  it("renders the <Html> component", () => {
    const actualOutput = render(<Html />);
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><html dir=\\"ltr\\" id=\\"__react-email\\" lang=\\"en\\"></html>"',
    );
  });
});
