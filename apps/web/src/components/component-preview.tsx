"use client";

import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

interface ComponentPreviewProps {
  html: string;
  className?: string;
}

export const ComponentPreview = ({
  className,
  html,
}: ComponentPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState("30rem");

  useEffect(() => {
    const iframeElement = iframeRef.current;

    const adjustHeight = () => {
      if (iframeElement?.contentWindow) {
        const iframeDocument =
          iframeElement.contentDocument || iframeElement.contentWindow.document;
        const iframeHeight = iframeDocument.body.scrollHeight;
        setHeight(`calc(${iframeHeight}px + 6dvh)`);
      }
    };

    const handleLoad = () => {
      adjustHeight();

      if (iframeElement?.contentDocument) {
        const observer = new MutationObserver(adjustHeight);
        observer.observe(iframeElement.contentDocument.body, {
          childList: true,
          subtree: true,
          attributes: true,
        });
      }
    };

    if (iframeElement) {
      iframeElement.addEventListener("load", handleLoad);
    }

    return () => {
      if (iframeElement) {
        iframeElement.removeEventListener("load", handleLoad);
      }
    };
  }, [html]);

  return (
    <div className={classNames("relative", className)}>
      <iframe
        className="flex h-full w-full rounded-md bg-white py-[2dvh]"
        ref={iframeRef}
        srcDoc={html}
        style={{ height }}
        title="Component preview"
      />
    </div>
  );
};
