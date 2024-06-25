/* eslint-disable react/no-array-index-key */
import * as React from "react";
import type { PrismLangauge } from "./languages-available";
import type { Theme } from "./themes";
import { Prism } from "./prism";

export type CodeBlockProps = Readonly<{
  lineNumbers?: boolean;
  style?: React.CSSProperties;
  theme: Theme;
  language: PrismLangauge;
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
    } else if (typeof token.content === "string") {
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

/**
 * A component to show code using prismjs.
 */
export const CodeBlock = React.forwardRef<
  React.ElementRef<"pre">,
  CodeBlockProps
>((props, ref) => {
  const languageGrammar = Prism.languages[props.language];
  if (typeof languageGrammar === "undefined")
    throw new Error(
      `CodeBlock: There is no language defined on Prism called ${props.language}`,
    );

  const lines = props.code.match(/[^\r\n]+/g) ?? [];
  const tokensPerLine = lines.map((line) =>
    Prism.tokenize(line, languageGrammar),
  );

  return (
    <pre ref={ref} style={{ ...props.theme.base, ...props.style }}>
      <code>
        {tokensPerLine.map((tokensForLine, lineIndex) => (
          <p key={lineIndex}>
            {props.lineNumbers ? (
              <span
                style={{
                  paddingRight: 30,
                }}
              >
                {lineIndex + 1}
              </span>
            ) : null}
            {tokensForLine.map((token, i) => (
              <CodeBlockLine key={i} theme={props.theme} token={token} />
            ))}
          </p>
        ))}
      </code>
    </pre>
  );
});

CodeBlock.displayName = "CodeBlock";
