import { Container } from "./index";
import { render } from "@react-email/render";
import { Container } from "./index";

describe("<Container> component", () => {
  it("renders children correctly", () => {
    const testMessage = "Test message";
    const html = render(<Container>{testMessage}</Container>);
    expect(html).toContain(testMessage);
  });

  it("passes style and other props correctly", () => {
    const style = { maxWidth: 300, backgroundColor: "red" };
    const html = render(
      <Container style={style} data-testid="container-test">
        Test
      </Container>,
    );
    expect(html).toContain('style="max-width:300px;background-color:red"');
    expect(html).toContain('data-testid="container-test"');
  });

  it("renders correctly", () => {
    const container = render(
      <Container style={{ maxWidth: "300px" }}>
        <button type="button">Hi</button>
      </Container>,
    );

    expect(container).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><table align=\\"center\\" width=\\"100%\\" border=\\"0\\" cellPadding=\\"0\\" cellSpacing=\\"0\\" role=\\"presentation\\" style=\\"max-width:300px\\"><tbody><tr style=\\"width:100%\\"><td><button type=\\"button\\">Hi</button></td></tr></tbody></table>"',
    );
  });
});
