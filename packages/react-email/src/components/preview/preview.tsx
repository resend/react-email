import * as React from 'react';
import { markAsElement } from '../element-marker.js';

export type PreviewProps = Readonly<
  React.ComponentPropsWithoutRef<'div'> & {
    /**
     * @default true
     */
    useTitleTag?: boolean;
    children: string | string[];
  }
>;

const PREVIEW_MAX_LENGTH = 200;

export const Preview = React.forwardRef<HTMLDivElement, PreviewProps>(
  ({ children = '', useTitleTag = true, ...props }, ref) => {
    const text = truncate(
      Array.isArray(children) ? children.join('') : children,
    );

    return (
      <>
        {useTitleTag ? <title>{text}</title> : null}
        <div
          style={{
            display: 'none',
            overflow: 'hidden',
            lineHeight: '1px',
            opacity: 0,
            maxHeight: 0,
            maxWidth: 0,
          }}
          data-skip-in-text={true}
          {...props}
          ref={ref}
        >
          {text}
          {renderWhiteSpace(text)}
        </div>
      </>
    );
  },
);

Preview.displayName = 'Preview';
markAsElement(Preview);

const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: 'grapheme',
});

/**
 * Cuts the text to at most `PREVIEW_MAX_LENGTH` UTF-16 code units, only on
 * whole visible characters (graphemes). Emoji made of several characters, such
 * as families, flags and skin tones, are kept or dropped whole instead of
 * leaving a stray joiner, half a flag or a lone surrogate at the end.
 */
const truncate = (text: string) => {
  if (text.length <= PREVIEW_MAX_LENGTH) {
    return text;
  }

  let end = 0;
  for (const { segment } of graphemeSegmenter.segment(text)) {
    if (end + segment.length > PREVIEW_MAX_LENGTH) {
      break;
    }
    end += segment.length;
  }

  return text.slice(0, end);
};

const whiteSpaceCodes = '\xa0\u200C\u200B\u200D\u200E\u200F\uFEFF';
export const renderWhiteSpace = (text: string) => {
  if (text.length >= PREVIEW_MAX_LENGTH) {
    return null;
  }

  return <div>{whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - text.length)}</div>;
};
