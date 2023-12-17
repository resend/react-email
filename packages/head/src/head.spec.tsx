import { render } from "@react-email/render";
import { Head } from "./index";

describe("<Head> component", () => {
  it("renders children correctly", () => {
    const testMessage = "Test message";
    const html = render(<Head>{testMessage}</Head>);
    expect(html).toContain(testMessage);
  });

  it("renders correctly", () => {
    const actualOutput = render(<Head />);
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><head><meta content=\\"text/html; charset=UTF-8\\" http-equiv=\\"Content-Type\\"/></head>"',
    );
  });

  it("renders style tags", () => {
    const actualOutput = render(
      <Head>
        <style>
          {`body{
            color: red;
          }`}
        </style>
      </Head>,
    );
    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><head><meta content=\\"text/html; charset=UTF-8\\" http-equiv=\\"Content-Type\\"/><style>body{
                  color: red;
                }</style></head>"
    `);
  });
});
