import classNames from "classnames";

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
  return (
    <iframe
      className={classNames(
        "relative h-full bg-zinc-200 z-[2] m-auto -mt-4 flex rounded-md duration-300 transition-none ease-[cubic-bezier(.36,.66,.6,1)] [transition-behavior:allow-discrete]",
        activeView === "mobile" ? "w-[360px]" : "w-full",
        className,
      )}
      srcDoc={html}
      title="Component preview"
    />
  );
};
