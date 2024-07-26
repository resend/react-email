import { Markdown } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple markdown";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Markdown>
        {`## Hello, this is my email template

This is meant to be rendered as a paragraph. There is no way around it.

### Another heading that I wrote
        `}
      </Markdown>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Markdown>
        {`## Hello, this is my email template

This is meant to be rendered as a paragraph. There is no way around it.

### Another heading that I wrote
        `}
      </Markdown>
      {/* end pattern code */}
    </Layout>
  );
};

export default Tailwind;
