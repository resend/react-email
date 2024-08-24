import { render } from "@react-email/render";
import { Mso } from "./index";

describe("<Mso> component", () => {
  it("renders correctly", async () => {
    const actualOutput = await render(<Mso>Lorem ipsum</Mso>);
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><!--[if mso]>Lorem ipsum<![endif]-->"',
    );
  });

  it("renders correctly with complex children", async () => {
    const actualOutput = await render(
      <Mso>
        <div style={{ textDecoration: "underline" }}>
          <b>Lorem</b>
          <i>ipsum</i>
        </div>
      </Mso>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><!--[if mso]><div style="text-decoration:underline"><b>Lorem</b><i>ipsum</i></div><![endif]-->"',
    );
  });
});
