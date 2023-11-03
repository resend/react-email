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

const CodeBlockLine = ({
  token,
  theme,
}: {
  token: string | Prism.Token;
  theme: Theme;
}) => {
  if (token instanceof Prism.Token) {
    if (token.content instanceof Prism.Token) {
      return (
        <span style={theme[token.type]}>
          <CodeBlockLine theme={theme} token={token.content} />
        </span>
      );
    } else if (typeof token.content === "string") {
      return <span style={theme[token.type]}>{token.content}</span>;
    }
  } else if (typeof token === "string") {
    return token;
  }
};

/**
 * A component to show code using prismjs.
 */
export const CodeBlock: React.FC<CodeBlockProps> = (props) => {
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
    <pre style={{ ...props.theme.base, ...props.style }}>
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
};
