import { CodeBlock, Font, dracula } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <>
    <Font
      fallbackFontFamily="monospace"
      fontFamily="CommitMono"
      fontStyle="normal"
      fontWeight={400}
      webFont={{
        url: '/fonts/commit-mono/commit-mono-regular.ttf',
        format: 'truetype',
      }}
    />
    <CodeBlock
      code={`await resend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  react: EmailTemplate({ firstName: 'John' }),
});`}
      fontFamily="'CommitMono', monospace"
      language="javascript"
      theme={dracula}
    />
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
