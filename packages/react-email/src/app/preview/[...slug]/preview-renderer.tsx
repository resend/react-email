import { type ComponentProps, useState } from 'react';
import ReactDOM from 'react-dom';
import { mergeRefs } from '../../../utils/merge-refs';

type PreviewRendererProps = {
  children: React.ReactElement;
} & ComponentProps<'iframe'>;

export const PreviewRenderer = ({
  children,
  ...rest
}: PreviewRendererProps) => {
  const [iframeDocument, setIframeDocument] = useState<Document>();

  return (
    <>
      <iframe
        {...rest}
        onLoad={(event) => {
          setIframeDocument(event.currentTarget.contentDocument ?? undefined);
        }}
        ref={mergeRefs(rest.ref, (iframe) => {
          setIframeDocument(iframe?.contentDocument ?? undefined);
        })}
        id="preview-renderer-iframe"
      />
      {iframeDocument
        ? ReactDOM.createPortal(children, iframeDocument as unknown as Element)
        : null}
    </>
  );
};
