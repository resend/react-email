'use client';

import { createContext, useContext } from 'react';

const WorkspaceContext = createContext<string | undefined>(undefined);

interface WorkspaceProviderProps {
  /**
   * Stable identifier for the user's React Email project (typically a hash
   * of the project's absolute path). Used to namespace any per-project
   * browser persistence such as localStorage.
   */
  id: string;
  children: React.ReactNode;
}

export const WorkspaceProvider = ({ id, children }: WorkspaceProviderProps) => (
  <WorkspaceContext.Provider value={id}>{children}</WorkspaceContext.Provider>
);

export const useWorkspaceId = (): string => {
  const workspaceId = useContext(WorkspaceContext);

  if (typeof workspaceId === 'undefined') {
    throw new Error(
      'Cannot call `useWorkspaceId` outside of a `WorkspaceProvider`.',
    );
  }

  return workspaceId;
};
