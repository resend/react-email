import { render } from "@react-email/render";
import { Heading } from "./index";

describe("render", () => {
  it("renders children correctly", () => {
    const testMessage = "Test message";
    const html = render(<Heading>{testMessage}</Heading>);
    expect(html).toContain(testMessage);
  });

  it("passes style and other props correctly", () => {
    const style = { backgroundColor: "red" };
    const html = render(
      <Heading data-testid="heading-test" style={style}>
        Test
      </Heading>,
    );
    expect(html).toContain("background-color:red");
    expect(html).toContain('data-testid="heading-test"');
  });

  it("renders the <Heading> component", () => {
    const actualOutput = render(
      <Heading as="h2" mx={4}>
        Lorem ipsum
      </Heading>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><h2 style=\\"margin-left:4px;margin-right:4px\\">Lorem ipsum</h2>"`,
    );
  });
});
