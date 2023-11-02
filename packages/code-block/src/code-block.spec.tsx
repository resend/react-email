import { render } from "@react-email/render";

import { CodeBlock, themes } from "./code-block";

describe("<CodeBlock> component", () => {
  it("renders correctly", () => {
    const code = `export default async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const html = await renderAsync(
          EmailTemplate({ firstName: 'John' }) as React.ReactElement
        );
        return NextResponse.json({ html });
      } catch (error) {
        return NextResponse.json({ error });
      }
    }`;

    const html = render(<CodeBlock 
      code={code} 
      language="typescript" 
      theme={themes.dracula}
    />);

    expect(html).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><hr style=\\"width:100%;border:none;border-top:1px solid #eaeaea\\"/>"`
    );
  });
});
