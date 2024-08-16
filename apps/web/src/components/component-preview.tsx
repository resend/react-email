import classNames from "classnames";

interface ComponentPreviewProps {
  html: string;
  className?: string;
}

export const ComponentPreview = ({
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
