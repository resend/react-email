import { render } from "@react-email/render";
import { Html } from "./index";

describe("<Html> component", () => {
  it("renders children correctly", () => {
    const testMessage = "Test message";
    const html = render(<Html>{testMessage}</Html>);
    expect(html).toContain(testMessage);
  });

  it("passes props correctly", () => {
    const html = render(<Html lang="fr" dir="rtl" data-testid="html-test" />);
    expect(html).toContain('lang="fr"');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('data-testid="html-test"');
  });

  it("renders correctly", () => {
    const actualOutput = render(<Html />);
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><html dir=\\"ltr\\" lang=\\"en\\"></html>"',
    );
  });
});
