import { render } from "@react-email/render";
import { Column } from "./index";

describe("<Column> component", () => {
  it("renders children correctly", () => {
    const testMessage = "Test message";
    const html = render(<Column>{testMessage}</Column>);
    expect(html).toContain(testMessage);
  });

  it("passes style and other props correctly", () => {
    const style = { backgroundColor: "red" };
    const html = render(
      <Column style={style} data-testid="column-test">
        Test
      </Column>,
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="column-test"');
  });

  it("renders correctly", () => {
    const actualOutput = render(<Column>Lorem ipsum</Column>);
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><td data-id=\\"__react-email-column\\">Lorem ipsum</td>"',
    );
  });
});
