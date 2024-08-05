import { CodeBlock } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Code Block without theme";

export const None = () => {
  return (
    <CodeBlock
      code={`await resend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<strong>it works!</strong>',
});`}
      language="javascript"
      theme={{}}
    />
  );
};

export default () => (
  <Layout>
    <None />
  </Layout>
);
