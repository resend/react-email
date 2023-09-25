import { Html } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Html> component", () => {
    const actualOutput = render(<Html />);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><html lang=\\"en\\" dir=\\"ltr\\"></html>"`,
    );
  });

  it("renders the <Html> correctly with children", () => {
    const actualOutput = render(
      <Html>
        <p>Hello World!</p>
      </Html>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><html lang=\\"en\\" dir=\\"ltr\\"><p>Hello World!</p></html>"`,
    );
  });

  it("renders the <Html> component with correct props", () => {
    const actualOutput = render(<Html lang="fr" dir="rtl" />);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><html lang=\\"fr\\" dir=\\"rtl\\"></html>"`,
    );
  });
});
