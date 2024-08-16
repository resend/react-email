import { useRef } from "react";
import classNames from "classnames";
import { renderAsync } from "@react-email/components";

interface ComponentPreviewProps {
  html: string;
  className?: string;
}

export const ComponentPreview = async ({
  className,
  html,
}: ComponentPreviewProps) => {
  return (
    <div className={classNames("relative", className)}>
      <iframe
        className="flex min-h-[350px] w-full items-center justify-center rounded-md bg-white"
        srcDoc={html}
        title="Component preview"
      />
    </div>
  );
};
