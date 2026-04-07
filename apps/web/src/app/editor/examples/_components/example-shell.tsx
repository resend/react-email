'use client';

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
      <h2 className="text-lg font-semibold text-slate-12 mb-1">{title}</h2>
      <p className="text-sm text-slate-11 mb-4">{description}</p>
      <div className="border border-slate-4 rounded-xl p-4 flex-1">
        {children}
      </div>
    </div>
  );
}
