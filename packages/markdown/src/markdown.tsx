import type { StylesType } from "md-to-react-email";
import { parseMarkdownToJSX } from "md-to-react-email";
import * as React from "react";

export interface MarkdownProps {
  children: string;
  markdownCustomStyles?: StylesType;
  markdownContainerStyles?: React.CSSProperties;
}

export const Markdown: React.FC<MarkdownProps> = ({
  children,
  markdownContainerStyles,
  markdownCustomStyles,
  ...props
}) => {
  const parsedMarkdown = parseMarkdownToJSX({
    markdown: children,
    customStyles: markdownCustomStyles,
  });

  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: parsedMarkdown }}
      data-id="react-email-markdown"
      style={markdownContainerStyles}
    />
  );
};
