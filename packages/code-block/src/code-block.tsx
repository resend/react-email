/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import type { PrismLanguage } from './languages-available';
import { Prism } from './prism';
import type { Theme } from './themes';

export type CodeBlockProps = Readonly<{
  lineNumbers?: boolean;
  style?: React.CSSProperties;

  /**
   * This applies a certain font family on all elements render in this component,
   * it is mostly meant to override a global font that has already been used with
   * our `<Font>` component
   */
  fontFamily?: string;

  theme: Theme;
  language: PrismLanguage;
  code: string;
}>;

const stylesForToken = (token: Prism.Token, theme: Theme) => {
  let styles = { ...theme[token.type] };

  const aliases = Array.isArray(token.alias) ? token.alias : [token.alias];

  for (const alias of aliases) {
    styles = { ...styles, ...theme[alias] };
  }

  return styles;
};

const CodeBlockLine = ({
  token,
  theme,
  inheritedStyles,
}: {
  token: string | Prism.Token;
  theme: Theme;
  inheritedStyles?: React.CSSProperties;
}) => {
  if (token instanceof Prism.Token) {
    const styleForToken = {
      ...inheritedStyles,
      ...stylesForToken(token, theme),
    };

    if (token.content instanceof Prism.Token) {
      return (
        <span style={styleForToken}>
          <CodeBlockLine theme={theme} token={token.content} />
        </span>
      );
    }
    if (typeof token.content === 'string') {
      return <span style={styleForToken}>{token.content}</span>;
    }
    return (
      <>
        {token.content.map((subToken, i) => (
          <CodeBlockLine
            inheritedStyles={styleForToken}
            key={i}
            theme={theme}
            token={subToken}
          />
        ))}
      </>
    );
  }

  return <span style={inheritedStyles}>{token}</span>;
};

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  (props, ref) => {
    const languageGrammar = Prism.languages[props.language];
    if (typeof languageGrammar === 'undefined') {
      throw new Error(
        `CodeBlock: There is no language defined on Prism called ${props.language}`,
      );
    }

    const lines = props.code.split(/\r\n|\r|\n/gm);
    const tokensPerLine = lines.map((line) =>
      Prism.tokenize(line, languageGrammar),
    );

    return (
      <pre
        ref={ref}
        style={{ ...props.theme.base, width: '100%', ...props.style }}
      >
        <code>
          {tokensPerLine.map((tokensForLine, lineIndex) => (
            <p key={lineIndex} style={{ margin: 0, minHeight: '1em' }}>
              {props.lineNumbers ? (
                <span
                  style={{
                    width: '2em',
                    display: 'inline-block',
                    fontFamily: props.fontFamily,
                  }}
                >
                  {lineIndex + 1}
                </span>
              ) : null}

              {tokensForLine.map((token, i) => (
                <CodeBlockLine
                  inheritedStyles={{ fontFamily: props.fontFamily }}
                  key={i}
                  theme={props.theme}
                  token={token}
                />
              ))}
            </p>
          ))}
        </code>
      </pre>
    );
  },
);

CodeBlock.displayName = 'CodeBlock';
