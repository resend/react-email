import { Button } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Button> component", () => {
    const actualOutput = render(
      <Button pX={20} pY={12} href="https://example.com" />,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><a href=\\"https://example.com\\" data-id=\\"react-email-button\\" target=\\"_blank\\" style=\\"line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 20px\\"><span><!--[if mso]><i style=\\"letter-spacing: 20px;mso-font-width:-100%;mso-text-raise:18\\" hidden>&nbsp;</i><![endif]--></span><span style=\\"max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px\\"></span><span><!--[if mso]><i style=\\"letter-spacing: 20px;mso-font-width:-100%\\" hidden>&nbsp;</i><![endif]--></span></a>"`,
    );
  });

  it("renders the <Button> component with no padding value", () => {
    const actualOutput = render(<Button href="https://example.com" />);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><a href=\\"https://example.com\\" data-id=\\"react-email-button\\" target=\\"_blank\\" style=\\"line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:0px 0px\\"><span><!--[if mso]><i style=\\"letter-spacing: 0px;mso-font-width:-100%;mso-text-raise:0\\" hidden>&nbsp;</i><![endif]--></span><span style=\\"max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:0\\"></span><span><!--[if mso]><i style=\\"letter-spacing: 0px;mso-font-width:-100%\\" hidden>&nbsp;</i><![endif]--></span></a>"`,
    );
  });
});
