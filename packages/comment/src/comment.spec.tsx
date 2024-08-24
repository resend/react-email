import { render } from "@react-email/render";
import { Comment } from "./index";

describe("<Comment> component", () => {
  it("renders correctly", async () => {
    const actualOutput = await render(<Comment>Lorem ipsum</Comment>);
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><!--Lorem ipsum-->"',
    );
  });
});
