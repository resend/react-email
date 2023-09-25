import { Hr } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Hr> component", () => {
    const actualOutput = render(<Hr />);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><hr style=\\"width:100%;border:none;border-top:1px solid #eaeaea\\"/>"`,
    );
  });

  it("renders the <Hr> correct styles", () => {
    const actualOutput = render(
      <Hr
        style={{
          width: "50%",
          borderColor: "black",
        }}
      />,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><hr style=\\"width:50%;border:none;border-top:1px solid #eaeaea;border-color:black\\"/>"`,
    );
  });
});
