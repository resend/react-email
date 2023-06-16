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

  it("renders the headers in the correct format for browsers", () => {
    const actualOutput = render(
      <Markdown>
        {`
# Heading 1!
## Heading 2!
### Heading 3!
#### Heading 4!
##### Heading 5!
###### Heading 6!
       `}
      </Markdown>
    );
    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><div data-id=\\"react-email-markdown\\"><Section>
      <Heading as=\\"h1\\" style=\\"font-weight:500;padding-top:20;font-size:2.5rem\\">Heading 1!</Heading>
      <Heading as=\\"h2\\" style=\\"font-weight:500;padding-top:20;font-size:2rem\\">Heading 2!</Heading>
      <Heading as=\\"h3\\" style=\\"font-weight:500;padding-top:20;font-size:1.75rem\\">Heading 3!</Heading>
      <Heading as=\\"h4\\" style=\\"font-weight:500;padding-top:20;font-size:1.5rem\\">Heading 4!</Heading>
      <Heading as=\\"h5\\" style=\\"font-weight:500;padding-top:20;font-size:1.25rem\\">Heading 5!</Heading>
      <Heading as=\\"h6\\" style=\\"font-weight:500;padding-top:20;font-size:1rem\\">Heading 6!</Heading>
             </Section></div>"
    `);
  });

  it("renders text in the correct format for browsers", () => {
    const actualOutput = render(
      <Markdown>{`**This is sample bold text in markdown** and *this is italic text*`}</Markdown>
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><div data-id=\\"react-email-markdown\\"><Section><Text style=\\"font-weight:bold\\">This is sample bold text in markdown</Text> and <Text style=\\"font-style:italic\\">this is italic text</Text></Section></div>"`
    );
  });

  it("renders links in the correct format for browsers", () => {
    const actualOutput = render(
      <Markdown>{`Link to [React-email](https://react.email)`}</Markdown>
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><div data-id=\\"react-email-markdown\\"><Section>Link to <Link href=\\"https://react.email\\" style=\\"color:#007bff;text-decoration:underline;background-color:transparent\\">React-email</Link></Section></div>"`
    );
  });

  it("renders lists in the correct format for browsers", () => {
    const actualOutput = render(
      <Markdown>
        {`
# Below is a list 

- Item One
- Item Two
- Item Three
       `}
      </Markdown>
    );
    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><div data-id=\\"react-email-markdown\\"><Section>
      <Heading as=\\"h1\\" style=\\"font-weight:500;padding-top:20;font-size:2.5rem\\">Below is a list </Heading>
      <ul style=\\"\\"><li style=\\"\\">Item One</li>
      <li style=\\"\\">Item Two</li>
      <li style=\\"\\">Item Three</li></ul>
             </Section></div>"
    `);
  });
});
