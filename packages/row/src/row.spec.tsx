/* eslint-disable react/no-children-prop */
import { render } from "@react-email/render";
import { Row } from "./index";

describe("<Row> component", () => {
  it("renders children correctly", () => {
    const testMessage = "Test message";
    const html = render(<Row>{testMessage}</Row>);
    expect(html).toContain(testMessage);
  });

  it("passes style and other props correctly", () => {
    const style = { backgroundColor: "red" };
    const html = render(
      <Row style={style} data-testid="row-test">
        Test
      </Row>,
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="row-test"');
  });

  it("renders correctly", () => {
    const actualOutput = render(<Row children={undefined} />);
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><table align=\\"center\\" width=\\"100%\\" border=\\"0\\" cellPadding=\\"0\\" cellSpacing=\\"0\\" role=\\"presentation\\"><tbody style=\\"width:100%\\"><tr style=\\"width:100%\\"></tr></tbody></table>"',
    );
  });
});
