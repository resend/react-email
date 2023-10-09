import { render } from "@react-email/render";
import { Link } from "./index";

describe("<Link> component", () => {
  it("renders children correctly", () => {
    const testMessage = "Test message";
    const html = render(<Link href="https://example.com">{testMessage}</Link>);
    expect(html).toContain(testMessage);
  });

  it("passes style and other props correctly", () => {
    const style = { color: "red" };
    const html = render(
      <Link href="https://example.com" style={style} data-testid="link-test">
        Test
      </Link>,
    );
    expect(html).toContain("color:red");
    expect(html).toContain('data-testid="link-test"');
  });

  it("opens in a new tab", () => {
    const html = render(<Link href="https://example.com">Test</Link>);
    expect(html).toContain(`target="_blank"`);
  });

  it("renders correctly", () => {
    const actualOutput = render(
      <Link href="https://example.com">Example</Link>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><a href=\\"https://example.com\\" style=\\"color:#067df7;text-decoration:none\\" target=\\"_blank\\">Example</a>"',
    );
  });
});
