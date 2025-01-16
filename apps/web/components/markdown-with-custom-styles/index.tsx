import { Markdown } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Markdown
    markdownCustomStyles={{
      h1: { color: 'red' },
      h2: { color: 'blue' },
      codeInline: { background: 'grey' },
    }}
  >
    {`## Hello, this is my email template

This is meant to be rendered as a paragraph. There is no way around it.

### Another heading that I wrote
        `}
  </Markdown>
);

export default () => {
  return <Layout>{component}</Layout>;
};
