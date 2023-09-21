import { Body } from "./index";
import { render } from "@react-email/render";

describe("Body component", () => {
  it("renders children correctly", () => {
    const testMessage = "Test message";
    const html = render(<Body>{testMessage}</Body>);
    expect(html).toContain(testMessage);
  });

  it("passes style and other props correctly", () => {
    const style = { backgroundColor: "red" };
    const html = render(
      <Body style={style} data-testid="body-test">
        Test
      </Body>,
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="body-test"');
  });

  it("has correct data-id attribute", () => {
    const html = render(<Body>Test</Body>);
    expect(html).toContain('data-id="__react-email-body"');
  });
});

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Body> component", () => {
    const actualOutput = render(<Body>Lorem ipsum</Body>);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><body data-id=\\"__react-email-body\\">Lorem ipsum</body>"`,
    );
  });
});
