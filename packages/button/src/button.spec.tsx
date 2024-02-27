import { render } from "@react-email/render";
import { Button } from "./index";

describe("<Button> component", () => {
  it("renders children correctly", () => {
    const testMessage = "Test message";
    const html = render(<Button>{testMessage}</Button>);
    expect(html).toContain(testMessage);
  });

  it("passes style and other props correctly", () => {
    const style = { backgroundColor: "red" };
    const html = render(
      <Button data-testid="button-test" style={style}>
        Test
      </Button>,
    );
    expect(html).toContain("background-color:red");
    expect(html).toContain('data-testid="button-test"');
  });

  it("renders correctly  with padding values from style prop", () => {
    const actualOutput = render(
      <Button href="https://example.com" style={{ padding: "12px 20px" }} />,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it("renders the <Button> component with no padding value", () => {
    const actualOutput = render(<Button href="https://example.com" />);
    expect(actualOutput).toMatchSnapshot();
  });

  it("should allow users to overwrite style props", () => {
    const actualOutput = render(
      <Button
        style={{
          lineHeight: "150%",
          display: "block",
          textDecoration: "underline red",
          maxWidth: "50%",
        }}
      />,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
