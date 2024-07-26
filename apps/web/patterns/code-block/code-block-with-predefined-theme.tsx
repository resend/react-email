import { CodeBlock, dracula } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Code Block with predefined theme";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <CodeBlock
        code={`await resend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<strong>it works!</strong>',
});`}
        language="javascript"
        theme={dracula}
      />
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <CodeBlock
        code={`await resend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<strong>it works!</strong>',
});`}
        language="javascript"
        theme={dracula}
      />
      {/* end pattern code */}
    </Layout>
  );
};

export default Tailwind;
