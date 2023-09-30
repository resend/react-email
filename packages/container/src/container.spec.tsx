import { render } from "@react-email/render";
import { Container } from "./index";

describe("render", () => {
  it("renders the <Container> component", () => {
    const container = render(
      <Container style={{ maxWidth: "300px" }}>
        <button type="button">Hi</button>
      </Container>,
    );

    expect(container).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><table align=\\"center\\" width=\\"100%\\" border=\\"0\\" cellPadding=\\"0\\" cellSpacing=\\"0\\" data-id=\\"__react-email-container\\" role=\\"presentation\\" style=\\"max-width:300px\\"><tbody><tr style=\\"width:100%\\"><td><button type=\\"button\\">Hi</button></td></tr></tbody></table>"',
    );
  });
});
