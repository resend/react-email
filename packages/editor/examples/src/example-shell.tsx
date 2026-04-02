interface ExampleShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ExampleShell({
  title,
  description,
  children,
}: ExampleShellProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold text-(--re-text) mb-1">{title}</h2>
      <p className="text-sm text-(--re-text-muted) mb-4">{description}</p>
      <div className="border border-(--re-border) rounded-xl p-4 flex-1 bg-white text-black">
        {children}
      </div>
    </div>
  );
}
