import { Markdown } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Simple markdown";

export const None = () => {
  return (
    <Markdown>
      {`## Hello, this is my email template

This is meant to be rendered as a paragraph. There is no way around it.

### Another heading that I wrote
        `}
    </Markdown>
  );
};

export default () => (
  <Layout>
    <None />
  </Layout>
);
