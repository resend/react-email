import { render } from "@react-email/render";
import { Button } from "./index";

describe("<Button> component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

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
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><a href=\\"https://example.com\\" style=\\"padding:12px 20px 12px 20px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%\\" target=\\"_blank\\"><span><!--[if mso]><i style=\\"letter-spacing: 20px;mso-font-width:-100%;mso-text-raise:18\\" hidden>&nbsp;</i><![endif]--></span><span style=\\"max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px\\"></span><span><!--[if mso]><i style=\\"letter-spacing: 20px;mso-font-width:-100%\\" hidden>&nbsp;</i><![endif]--></span></a>"',
    );
  });

  it("renders the <Button> component with no padding value", () => {
    const actualOutput = render(<Button href="https://example.com" />);
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><a href=\\"https://example.com\\" style=\\"line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:0px 0px 0px 0px\\" target=\\"_blank\\"><span><!--[if mso]><i style=\\"letter-spacing: 0px;mso-font-width:-100%;mso-text-raise:0\\" hidden>&nbsp;</i><![endif]--></span><span style=\\"max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:0\\"></span><span><!--[if mso]><i style=\\"letter-spacing: 0px;mso-font-width:-100%\\" hidden>&nbsp;</i><![endif]--></span></a>"',
    );
  });
});
