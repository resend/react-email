'use client';

import { createContext, useContext } from 'react';

export const ExamplePageContext = createContext(false);

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
  const hideHeader = useContext(ExamplePageContext);

  return (
    <div className="flex flex-col h-full">
      {!hideHeader && (
        <>
          <h2 className="text-lg font-semibold text-slate-12 mb-1">{title}</h2>
          <p className="text-sm text-slate-11 mb-4">{description}</p>
        </>
      )}
      <div className="example-shell-content focus-visible:outline-none overflow-hidden border border-slate-4 rounded-xl p-4 flex-1 min-h-[350px] flex flex-col grow">
        {children}
      </div>
    </div>
  );
}
