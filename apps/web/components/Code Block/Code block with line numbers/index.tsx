import { CodeBlock, dracula } from "@react-email/components";

export const component =  (
  <CodeBlock
    code={`await resend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<strong>it works!</strong>',
});`}
    language="javascript"
    lineNumbers
    theme={dracula}
  />
);
