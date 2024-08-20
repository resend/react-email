"use client";

import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState("30rem");

  useEffect(() => {
    const iframeElement = iframeRef.current;

    const adjustHeight = () => {
      if (iframeElement?.contentWindow) {
        const iframeDocument =
          iframeElement.contentDocument || iframeElement.contentWindow.document;
        const iframeHeight = iframeDocument.body.scrollHeight;
        setHeight(`calc(${iframeHeight}px + 2dvh)`);
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
    <div
      className={classNames(
        "relative flex items-center justify-center overflow-auto",
        className,
      )}
    >
      <iframe
        className={classNames(
          "flex h-full w-full rounded-md",
          activeView === "mobile" && "max-w-80",
        )}
        ref={iframeRef}
        srcDoc={html}
        style={{ height }}
        title="Component preview"
      />
    </div>
  );
};
