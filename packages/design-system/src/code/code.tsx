import classnames from 'classnames';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import * as React from 'react';
import { IconButton } from '../icon-button';
import { copyTextToClipboard } from 'utils';
import { IconClipboard, IconCheck } from '../icons';

interface CodeProps {
  children: any;
  className?: string;
  language?: string;
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
  className,
  language = 'html',
  ...props
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const value = children.trim();

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={value}
      language={language as Language}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre
          className={classnames(
            'relative my-8 w-full min-w-full max-w-full overflow-auto whitespace-pre rounded-md border border-gray-6 p-4 text-sm backdrop-blur-md',
            className,
          )}
          style={{
            lineHeight: '130%',
            background:
              'linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)',
            boxShadow: 'rgb(0 0 0 / 10%) 0px 5px 30px -5px',
          }}
        >
          <IconButton
            className="absolute top-3 right-3 hidden md:block"
            onClick={async () => {
              setIsCopied(true);
              await copyTextToClipboard(value);
              setTimeout(() => setIsCopied(false), 3000);
            }}
          >
            {isCopied ? <IconCheck /> : <IconClipboard />}
          </IconButton>

          <div
            className="absolute right-0 top-0 h-px w-[300px]"
            style={{
              background:
                'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
            }}
          />
          {tokens.map((line, i) => {
            return (
              <div
                key={i}
                {...getLineProps({ line, key: i })}
                className={classnames('whitespace-pre', {
                  "before:text-gray-11 before:mr-2 before:content-['$']":
                    language === 'bash' && tokens.length === 1,
                })}
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
                      <span {...getTokenProps({ token, key })} />
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
          <div
            className="absolute left-0 bottom-0 h-px w-[300px]"
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
