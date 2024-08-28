import { render } from "@react-email/render";
import { Body } from "./index";

describe("<Body> component", () => {
  it("renders children correctly", async () => {
    const testMessage = "Test message";
    const html = await render(<Body>{testMessage}</Body>);
    expect(html).toContain(testMessage);
  });

  it("passes style and other props correctly", async () => {
    const style = { backgroundColor: "red" };
    const html = await render(
      <Body data-testid="body-test" style={style}>
        Test
      </Body>,
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="body-test"');
  });

  it("renders correctly", async () => {
    const actualOutput = await render(<Body>Lorem ipsum</Body>);
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><!--$--><body>Lorem ipsum<!--/$--></body>"',
    );
  });
});
