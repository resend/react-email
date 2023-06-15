import { render } from "@react-email/render";
import { Markdown } from "./markdown";

describe("ReactEmailMarkdown component renders correctly", () => {
  it("renders the markdown in the correct format for browsers", () => {
    const actualOutput = render(
      <Markdown>
        {`
# This is a ~~chair~~ Table
       
| Heading 1 | Heading 2 |
| --------- | --------- |
| Cell 1    | Cell 2    |
| Cell 3    | Cell 4    |
       `}
      </Markdown>
    );
    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><div data-id=\\"react-email-markdown\\"><Section>
      <Heading as=\\"h1\\" style=\\"font-weight:500;padding-top:20;font-size:2.5rem\\">This is a <del style=\\"\\">chair</del> Table</Heading>
             <table style=\\"\\"><thead style=\\"\\"><tr style=\\"\\"><th style=\\"\\" align=\\"center\\">Heading 1</th><th style=\\"\\" align=\\"center\\">Heading 2</th></tr></thead><tbody style=\\"\\"><tr style=\\"\\"><td style=\\"\\" align=\\"center\\">Cell 1</td><td style=\\"\\" align=\\"center\\">Cell 2</td></tr><tr style=\\"\\"><td style=\\"\\" align=\\"center\\">Cell 3</td><td style=\\"\\" align=\\"center\\">Cell 4</td></tr></tbody></table>       </Section></div>"
    `);
  });
});
