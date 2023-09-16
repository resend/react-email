import classnames from 'classnames';
import { Highlight, Language } from 'prism-react-renderer';
import * as React from 'react';

import { PreviewLanguage } from '../helpers';

interface CodeProps {
  children: any;
  className?: string;
  language?: PreviewLanguage;
}

const theme = {
  plain: {
    color: '#EDEDEF',
    fontFamily: 'MonoLisa, Menlo, monospace',
    fontSize: 13
  },
  styles: [
    {
      style: {
        color: '#706F78'
      },
      types: ['comment']
    },
    {
      style: {
        color: '#7E7D86'
      },
      types: ['atrule', 'keyword', 'attr-name', 'selector']
    },
    {
      style: {
        color: '#706F78'
      },
      types: ['punctuation', 'operator']
    },
    {
      style: {
        color: '#EDEDEF'
      },
      types: ['class-name', 'function', 'tag', 'key-white']
    }
  ]
};

export const Code: React.FC<Readonly<CodeProps>> = ({ children, language = 'html' }) => {
  // const [isCopied, setIsCopied] = React.useState(false);
  const value = children.trim();

  // const file = new File([value], `email.${language}`);
  // const url = URL.createObjectURL(file);

  return (
    <Highlight theme={theme} code={value} language={language as Language}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          <div
            className="absolute right-0 top-0 h-px w-[200px]"
            style={{
              background:
                'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)'
            }}
          />
          <div className="p-4 h-[650px] overflow-auto">
            {tokens.map((line, i) => {
              const { key: lineKey, ...lineProps } = getLineProps({ key: i, line });
              return (
                <div key={i} {...lineProps} className={classnames('whitespace-pre')}>
                  {line.map((token, key) => {
                    const { key: tokenKey, ...tokenProps } = getTokenProps({ key, token });
                    const isException = token.content === 'from' && line[key + 1]?.content === ':';
                    const newTypes = isException ? [...token.types, 'key-white'] : token.types;
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
          </div>
          <div
            className="absolute left-0 bottom-0 h-px w-[200px]"
            style={{
              background:
                'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)'
            }}
          />
        </>
      )}
    </Highlight>
  );
};
