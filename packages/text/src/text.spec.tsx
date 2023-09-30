import { render } from "@react-email/render";
import { Text } from "./index";

describe("render", () => {
  it("renders the <Text> component", () => {
    const actualOutput = render(<Text>Lorem ipsum</Text>);
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><p data-id=\\"react-email-text\\" style=\\"font-size:14px;line-height:24px;margin:16px 0\\">Lorem ipsum</p>"',
    );
  });
});
