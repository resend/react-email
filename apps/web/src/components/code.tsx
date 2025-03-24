'use client';

import classNames from 'classnames';
import { CheckIcon, ClipboardIcon } from 'lucide-react';
import { Highlight } from 'prism-react-renderer';
import * as React from 'react';
import { IconButton } from './icon-button';

interface CodeProps {
  children: string;
  className?: string;
  language?: string;
}

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

export const Code: React.FC<Readonly<CodeProps>> = ({
  children,
  className,
  language = 'html',
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const value = children.trim();

  return (
    <Highlight code={value} language={language} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre
          className={classNames(
            'relative inline-flex h-11 w-full items-center overflow-auto whitespace-pre rounded-md border border-slate-6 pl-4 pr-11 font-mono text-sm backdrop-blur-md',
            className,
          )}
          style={{
            lineHeight: '130%',
            background:
              'linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)',
            boxShadow: 'rgb(0 0 0 / 10%) 0rem .3125rem 1.875rem -0.3125rem',
          }}
        >
          <IconButton
            className="absolute right-3"
            onClick={() => {
              setIsCopied(true);
              void navigator.clipboard.writeText(value);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {isCopied ? (
              <CheckIcon className="mt-[-0.0938rem]" size={16} />
            ) : (
              <ClipboardIcon className="mt-[-0.0938rem]" size={16} />
            )}
          </IconButton>
          <div
            className="absolute right-0 top-0 h-px w-[12.5rem]"
            style={{
              background:
                'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
            }}
          />
          {tokens.map((line, i) => {
            return (
              <div
                {...getLineProps({ line, key: i })}
                className={classNames('whitespace-pre', {
                  "before:mr-2 before:text-slate-11 before:content-['$']":
                    language === 'bash' && tokens.length === 1,
                })}
                key={i}
              >
                {line.map((token, key) => {
                  const isException =
                    token.content === 'from' && line[key + 1]?.content === ':';
                  const newTypes = isException
                    ? [...token.types, 'key-white']
                    : token.types;
                  token.types = newTypes;

                  return (
                    <React.Fragment key={key}>
                      <span {...getTokenProps({ token, key })} key={key} />
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
          <div
            className="absolute bottom-0 left-0 h-px w-[12.5rem]"
            style={{
              background:
                'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
            }}
          />
        </pre>
      )}
    </Highlight>
  );
};
