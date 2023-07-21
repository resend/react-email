import { Head } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Head> component", () => {
    const actualOutput = render(<Head />);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><head data-id=\\"__react-email-head\\"><meta http-equiv=\\"Content-Type\\" content=\\"text/html; charset=UTF-8\\"/></head>"`,
    );
  });

  it("renders children components", () => {
    const actualOutput = render(
      <Head>
        <title>My email title</title>
      </Head>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><head data-id=\\"__react-email-head\\"><meta http-equiv=\\"Content-Type\\" content=\\"text/html; charset=UTF-8\\"/><title>My email title</title></head>"`,
    );
  });
});
