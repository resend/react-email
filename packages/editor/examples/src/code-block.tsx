import type { Language } from 'prism-react-renderer';
import { Highlight } from 'prism-react-renderer';

const theme = {
  plain: {
    color: '#EDEDEF',
    fontSize: 13,
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
  },
  styles: [
    {
      types: ['comment'],
      style: { color: '#706F78' },
    },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: { color: '#7E7D86' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: '#706F78' },
    },
    {
      types: ['class-name', 'function', 'tag', 'key-white'],
      style: { color: '#EDEDEF' },
    },
  ],
};

interface CodeBlockProps {
  children: string;
  language?: Language;
}

export function CodeBlock({ children, language = 'tsx' }: CodeBlockProps) {
  const value = children.trim();

  return (
    <Highlight code={value} language={language} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className="m-0 p-4 overflow-auto text-[13px] leading-[1.7]">
          {tokens.map((line, i) => {
            const { key: _, ...lineProps } = getLineProps({ line, key: i });
            return (
              <div key={i} {...lineProps} className="whitespace-pre">
                {line.map((token, key) => {
                  const { key: __, ...tokenProps } = getTokenProps({
                    token,
                    key,
                  });
                  return <span key={key} {...tokenProps} />;
                })}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}
