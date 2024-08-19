import { CodeBlock } from "@react-email/components";
import { Layout } from "../_components/layout";

export const component =  (
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

export default () => {
  return (
    <Layout>
      {component}
    </Layout>
  );
};
