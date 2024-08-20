"use client";

import classNames from "classnames";
import { frame } from "framer-motion";
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

  const adjustHeight = (element: HTMLIFrameElement) => {
    if (element.contentWindow) {
      const iframeDocument =
        element.contentDocument || element.contentWindow.document;
      const iframeHeight = iframeDocument.body.scrollHeight;
      setHeight(`calc(${iframeHeight}px + 2dvh)`);
    }
  };

  const handleLoad = (element: HTMLIFrameElement) => {
    adjustHeight(element);

    if (iframeRef.current?.contentDocument) {
      const observer = new MutationObserver(() => {
        adjustHeight(element);
      });
      observer.observe(iframeRef.current.contentDocument.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
  };

  useEffect(() => {
    if (iframeRef.current) {
      handleLoad(iframeRef.current);
    }
  }, []);

  useEffect(() => {
    const element = iframeRef.current;

    if (element) {
      element.addEventListener("load", () => {
        handleLoad(element);
      });
    }

    return () => {
      if (element) {
        element.removeEventListener("load", () => {
          handleLoad(element);
        });
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
        onLoad={() => {
          console.log("onLoad");
        }}
        ref={iframeRef}
        srcDoc={html}
        style={{ height }}
        title="Component preview"
      />
    </div>
  );
};
