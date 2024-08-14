import { Markdown } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Markdown with container styles";

export const None = () => {
  return (
    <Markdown
      markdownContainerStyles={{
        marginBlock: 30,
      }}
    >
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
