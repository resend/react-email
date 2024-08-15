import { CodeBlock } from "@react-email/components";

export const pattern = (
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
