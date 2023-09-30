import { render } from "@react-email/render";
import { Row } from "./index";

describe("render", () => {
  it("renders the <Row> component", () => {
    const actualOutput = render(<Row>{null}</Row>);
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><table align=\\"center\\" width=\\"100%\\" border=\\"0\\" cellPadding=\\"0\\" cellSpacing=\\"0\\" data-id=\\"react-email-row\\" role=\\"presentation\\"><tbody style=\\"width:100%\\"><tr style=\\"width:100%\\"></tr></tbody></table>"',
    );
  });
});
