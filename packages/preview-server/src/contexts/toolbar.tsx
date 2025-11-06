'use client';

import { createContext, use } from 'react';

const ToolbarContext = createContext<
  | {
    hasSetupResendIntegration: boolean;
  }
  | undefined
>(undefined);

interface ToolbarProviderProps {
  hasApiKey: boolean;
  children: React.ReactNode;
}

export function ToolbarProvider({ hasApiKey, children }: ToolbarProviderProps) {
  return (
    <ToolbarContext.Provider value={{ hasSetupResendIntegration: hasApiKey }}>
      {children}
    </ToolbarContext.Provider>
  );
}

export const useToolbarContext = () => {
  const previewContext = use(ToolbarContext);

  if (typeof previewContext === 'undefined') {
    throw new Error(
      'Cannot call `useToolbarContext` outside of a `ToolbarContext` provider.',
    );
  }

  return previewContext;
};
