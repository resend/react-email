import { render } from "@react-email/render";
import { Section } from "./index";

describe("<Section> component", () => {
  it("renders correctly", () => {
    const actualOutput = render(<Section>Lorem ipsum</Section>);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><table align=\\"center\\" width=\\"100%\\" border=\\"0\\" cellPadding=\\"0\\" cellSpacing=\\"0\\" role=\\"presentation\\"><tbody><tr><td>Lorem ipsum</td></tr></tbody></table>"`,
    );
  });

  it("renders children correctly", () => {
    const testMessage = "Test message";
    const html = render(<Section>{testMessage}</Section>);
    expect(html).toContain(testMessage);
  });

  it("passes style and other props correctly", () => {
    const style = { backgroundColor: "red" };
    const html = render(
      <Section style={style} data-testid="section-test">
        Test
      </Section>,
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="section-test"');
  });

  it("renders with <td> wrapper if no <Column> is provided", () => {
    const actualOutput = render(
      <Section>
        <div>Lorem ipsum</div>
      </Section>,
    );
    expect(actualOutput).toContain("<td>");
  });

  it("renders with <td> wrapper if <Column> is provided", () => {
    const actualOutput = render(
      <Section>
        <td>Lorem ipsum</td>
      </Section>,
    );
    expect(actualOutput).toContain("<td>");
  });

  it("renders wrapping any child provided in a <td> tag", () => {
    const actualOutput = render(
      <Section>
        <div>Lorem ipsum</div>
        <p>Lorem ipsum</p>
        <img alt="Lorem" src="lorem.ipsum" />
      </Section>,
    );
    const tdChildrenArr = actualOutput.match(/<td\s*.*?>.*?<\/td>/g);
    expect(tdChildrenArr).toHaveLength(1);
  });
});
