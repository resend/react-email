import { Img } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Img> component", () => {
    const actualOutput = render(
      <Img src="cat.jpg" alt="Cat" width="300" height="300" />,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><img data-id=\\"react-email-img\\" alt=\\"Cat\\" src=\\"cat.jpg\\" width=\\"300\\" height=\\"300\\" style=\\"display:block;outline:none;border:none;text-decoration:none\\"/>"`,
    );
  });
});
