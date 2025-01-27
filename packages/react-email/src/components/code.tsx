import type { Language } from 'prism-react-renderer';
import { Highlight } from 'prism-react-renderer';
import * as React from 'react';
import { cn } from '../utils';

interface CodeProps {
  children: string;
  className?: string;
  language?: Language;
}

const theme = {
  plain: {
    color: '#EDEDEF',
    fontSize: 13,
    fontFamily: 'MonoLisa, Menlo, monospace',
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

export const Code: React.FC<Readonly<CodeProps>> = ({
  children,
  language = 'html',
}) => {
  const value = children.trim();

  return (
    <Highlight code={value} language={language} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          <div
            className="absolute right-0 top-0 h-px w-[200px]"
            style={{
              background:
                'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
            }}
          />
          <pre className="h-[650px] overflow-auto p-4">
            {tokens.map((line, i) => {
              const lineProps = getLineProps({
                line,
                key: i,
              });
              return (
                <div
                  {...lineProps}
                  className={cn('whitespace-pre', {
                    "before:mr-2 before:text-slate-11 before:content-['$']":
                      language === 'bash' && tokens.length === 1,
                  })}
                  key={i}
                >
                  {line.map((token, key) => {
                    const tokenProps = getTokenProps({
                      token,
                      key,
                    });
                    const isException =
                      token.content === 'from' &&
                      line[key + 1]?.content === ':';
                    const newTypes = isException
                      ? [...token.types, 'key-white']
                      : token.types;
                    token.types = newTypes;

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
          <div
            className="absolute bottom-0 left-0 h-px w-[200px]"
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
