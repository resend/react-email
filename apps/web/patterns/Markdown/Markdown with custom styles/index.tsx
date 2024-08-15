import { Markdown } from "@react-email/components";

export const pattern = (
  <Markdown
    markdownCustomStyles={{
      h1: { color: "red" },
      h2: { color: "blue" },
      codeInline: { background: "grey" },
    }}
  >
    {`## Hello, this is my email template

This is meant to be rendered as a paragraph. There is no way around it.

### Another heading that I wrote
        `}
  </Markdown>
);
