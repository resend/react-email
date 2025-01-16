import classNames from 'classnames';
import * as React from 'react';

interface ComponentPreviewProps {
  activeView: string;
  className?: string;
  html: string;
}

export const ComponentPreview = ({
  activeView,
  className,
  html,
}: ComponentPreviewProps) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current) {
        const iframeDocument = iframeRef.current.contentDocument;
        if (iframeDocument) {
          const body = iframeDocument.body;
          const htmlFrame = iframeDocument.documentElement;
          const height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            htmlFrame.clientHeight,
            htmlFrame.scrollHeight,
            htmlFrame.offsetHeight,
          );
          iframeRef.current.style.height = `${height + 20}px`;
        }
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleResize);

      handleResize();

      return () => {
        iframe.removeEventListener('load', handleResize);
      };
    }
  }, []);

  return (
    <iframe
      className={classNames(
        'relative z-[2] m-auto flex h-fit overflow-y-hidden rounded-md bg-zinc-200 transition-none duration-300 ease-[cubic-bezier(.36,.66,.6,1)] [transition-behavior:allow-discrete]',
        activeView === 'mobile' ? 'w-[22.5rem]' : 'w-full',
        className,
      )}
      ref={iframeRef}
      srcDoc={html}
      title="Component preview"
    />
  );
};
