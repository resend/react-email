'use client';

import classNames from 'classnames';
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
      <div
        className={classNames('example-shell-content p-4 flex-1', {
          'border border-slate-4 rounded-xl': !hideHeader,
        })}
      >
        {children}
      </div>
    </div>
  );
}
