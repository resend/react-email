import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"div">;

export interface PreviewProps extends RootProps {
  children: string | string[];
}

const PREVIEW_MAX_LENGTH = 150;

export const Preview: React.FC<Readonly<PreviewProps>> = ({
  children = "",
  ...props
}) => {
  let text = Array.isArray(children) ? children.join("") : children;
  text = text.substr(0, PREVIEW_MAX_LENGTH);
  return (
    <div
      id="__react-email-preview"
      style={{
        display: "none",
        overflow: "hidden",
        lineHeight: "1px",
        opacity: 0,
        maxHeight: 0,
        maxWidth: 0,
      }}
      {...props}
    >
      {text}
      {renderWhiteSpace(text)}
    </div>
  );
};

const renderWhiteSpace = (text: string) => {
  if (text.length >= PREVIEW_MAX_LENGTH) {
    return null;
  }
  const whiteSpaceCodes = "\xa0\u200C\u200B\u200D\u200E\u200F\uFEFF";
  return <div>{whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - text.length)}</div>;
};
