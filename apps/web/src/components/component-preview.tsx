"use client";

import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { renderToStaticMarkup } from "react-dom/server";

interface ComponentPreviewProps {
  component: React.ReactElement | string;
  hasReTrigger?: boolean;
  className?: string;
}

export const ComponentPreview = ({
  className,
  component,
  hasReTrigger = false,
}: ComponentPreviewProps) => {
  const [reTriggerKey, setReTriggerKey] = useState<number>(Date.now());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const reTrigger = () => {
    setReTriggerKey(Date.now());
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      reTrigger();
    }
  };

  useEffect(() => {
    if (iframeRef.current && component) {
      const htmlString =
        typeof component === "string"
          ? component
          : renderToStaticMarkup(component);

      iframeRef.current.srcdoc = htmlString;
    }
  }, [component, reTriggerKey]);

  return (
    <div className={classNames("relative", className)}>
      <iframe
        className="flex min-h-[350px] w-full items-center justify-center rounded-md"
        ref={iframeRef}
        title="Component preview"
      />
      {hasReTrigger ? (
        <div
          aria-label="Re-trigger component"
          className="absolute right-4 top-3 cursor-pointer"
          onClick={reTrigger}
          onKeyUp={handleKeyUp}
          role="button"
          tabIndex={0}
        />
      ) : null}
    </div>
  );
};