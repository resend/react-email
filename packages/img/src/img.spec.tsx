import { render } from "@react-email/render";
import { Img } from "./index";

describe("render", () => {
  it("renders the <Img> component", () => {
    const actualOutput = render(
      <Img alt="Cat" height="300" src="cat.jpg" width="300" />,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><img alt=\\"Cat\\" data-id=\\"react-email-img\\" height=\\"300\\" src=\\"cat.jpg\\" style=\\"display:block;outline:none;border:none;text-decoration:none\\" width=\\"300\\"/>"',
    );
  });
});
