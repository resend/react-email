import { render } from "@react-email/render";
import { Hr } from "./index";

describe("render", () => {
  it("renders the <Hr> component", () => {
    const actualOutput = render(<Hr />);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><hr data-id=\\"react-email-hr\\" style=\\"width:100%;border:none;border-top:1px solid #eaeaea\\"/>"`,
    );
  });
});
