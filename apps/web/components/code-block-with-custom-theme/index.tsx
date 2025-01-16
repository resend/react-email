import { CodeBlock, Font } from '@react-email/components';
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
      theme={{
        base: {
          color: '#839496',
          textShadow: '0 1px rgba(0, 0, 0, 0.3)',
          fontFamily:
            "Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace",
          direction: 'ltr',
          textAlign: 'left',
          whiteSpace: 'pre',
          wordSpacing: 'normal',
          wordBreak: 'normal',
          lineHeight: '1.5',
          MozTabSize: '4',
          OTabSize: '4',
          tabSize: '4',
          WebkitHyphens: 'none',
          MozHyphens: 'none',

          hyphens: 'none',
          padding: '1em',
          margin: '.5em 0',
          overflow: 'auto',
          borderRadius: '0.3em',
          background: '#002b36',
        },
        comment: {
          color: '#586e75',
        },
        prolog: {
          color: '#586e75',
        },
        doctype: {
          color: '#586e75',
        },
        cdata: {
          color: '#586e75',
        },
        punctuation: {
          color: '#93a1a1',
        },
        property: {
          color: '#268bd2',
        },
        keyword: {
          color: '#268bd2',
        },
        tag: {
          color: '#268bd2',
        },
        'class-name': {
          color: '#FFFFB6',
          textDecoration: 'underline',
        },
        boolean: {
          color: '#b58900',
        },
        constant: {
          color: '#b58900',
        },
        symbol: {
          color: '#dc322f',
        },
        deleted: {
          color: '#dc322f',
        },
        number: {
          color: '#859900',
        },
        selector: {
          color: '#859900',
        },
        'attr-name': {
          color: '#859900',
        },
        string: {
          color: '#859900',
        },
        char: {
          color: '#859900',
        },
        builtin: {
          color: '#859900',
        },
        inserted: {
          color: '#859900',
        },
        variable: {
          color: '#268bd2',
        },
        operator: {
          color: '#EDEDED',
        },
        function: {
          color: '#268bd2',
        },
        regex: {
          color: '#E9C062',
        },
        important: {
          color: '#fd971f',
          fontWeight: 'bold',
        },
        entity: {
          color: '#FFFFB6',
          cursor: 'help',
        },
        url: {
          color: '#96CBFE',
        },
        bold: {
          fontWeight: 'bold',
        },
        italic: {
          fontStyle: 'italic',
        },
        atrule: {
          color: '#F9EE98',
        },
        'attr-value': {
          color: '#F9EE98',
        },
      }}
    />
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
