import classNames from 'classnames';
import type { Language } from 'prism-react-renderer';
import { Highlight } from 'prism-react-renderer';
import * as React from 'react';

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
  codeClassName?: string;
  language?: Language;
  isGradientLine?: boolean;
}

export const CodeBlock: React.FC<Readonly<CodeBlockProps>> = ({
  children,
  language = 'html',
  className,
  codeClassName,
  isGradientLine = true,
}) => {
  const value = children.trim();

  return (
    <Highlight code={value} language={language} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {isGradientLine && (
            <div
              className="absolute top-0 right-0 h-px w-[12.5rem]"
              style={{
                background:
                  'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
              }}
            />
          )}

          <pre className={classNames('p-4 font-mono', className)}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i });

              return (
                <div
                  key={i}
                  {...lineProps}
                  className={classNames('whitespace-pre', codeClassName, {
                    "before:mr-2 before:text-slate-11 before:content-['$']":
                      language === 'bash' && tokens.length === 1,
                  })}
                >
                  {line.map((token, key) => {
                    const tokenProps = getTokenProps({ token, key });

                    const isException =
                      token.content === 'from' &&
                      line[key + 1]?.content === ':';
                    token.types = isException
                      ? [...token.types, 'key-white']
                      : token.types;

                    return (
                      <React.Fragment key={key}>
                        <span {...tokenProps} />
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}
          </pre>
          {isGradientLine && (
            <div
              className="absolute bottom-0 left-0 h-px w-[12.5rem]"
              style={{
                background:
                  'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
              }}
            />
          )}
        </>
      )}
    </Highlight>
  );
};
