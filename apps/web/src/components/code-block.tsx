import classNames from 'classnames';
import type { Language } from 'prism-react-renderer';
import { Highlight } from 'prism-react-renderer';

const theme = {
  plain: {
    color: '#EDEDEF',
    fontSize: 13,
    fontFamily: 'CommitMono, monospace',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        color: '#706F78',
      },
    },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: {
        color: '#7E7D86',
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: '#706F78',
      },
    },
    {
      types: ['class-name', 'function', 'tag', 'key-white'],
      style: {
        color: '#EDEDEF',
      },
    },
  ],
};

interface CodeBlockProps {
  children: string;
  className?: string;
  language?: Language;
}

export const CodeBlock: React.FC<Readonly<CodeBlockProps>> = ({
  children,
  language = 'html',
}) => {
  const value = children.trim();

  return (
    <Highlight code={value} language={language} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          <div
            className="absolute right-0 top-0 h-px w-[12.5rem]"
            style={{
              background:
                'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
            }}
          />

          <pre className="p-4 font-mono">
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line });

              return (
                <div
                  {...lineProps}
                  key={i}
                  className={classNames('whitespace-pre', {
                    "before:mr-2 before:text-slate-11 before:content-['$']":
                      language === 'bash' && tokens.length === 1,
                  })}
                >
                  {line.map((token, key) => {
                    const tokenProps = getTokenProps({ token });

                    const isException =
                      token.content === 'from' &&
                      line[key + 1]?.content === ':';
                    token.types = isException
                      ? [...token.types, 'key-white']
                      : token.types;

                    return <span {...tokenProps} key={key} />;
                  })}
                </div>
              );
            })}
          </pre>
          <div
            className="absolute bottom-0 left-0 h-px w-[12.5rem]"
            style={{
              background:
                'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
            }}
          />
        </>
      )}
    </Highlight>
  );
};
