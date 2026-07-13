'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  readWorkspaceValue,
  writeWorkspaceValue,
} from '../utils/workspace-storage';
import { useWorkspaceId } from './workspace';

const PropsPanelContext = createContext<
  | {
      open: boolean;
      setOpen: (open: boolean) => void;
      /**
       * False until the user toggles the panel, so restoring the remembered
       * state on load applies instantly instead of animating.
       */
      animated: boolean;
    }
  | undefined
>(undefined);

/**
 * Must stay mounted in the preview layout, which survives navigating between
 * templates — otherwise the panel closes or replays its opening animation on
 * every navigation.
 */
export const PropsPanelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const workspaceId = useWorkspaceId();
  const [open, setOpenState] = useState(false);
  const [animated, setAnimated] = useState(false);

  // Storage cannot be read during hydration, so the panel renders closed
  // first and the remembered state applies right after mount.
  useEffect(() => {
    const storedOpen = readWorkspaceValue<unknown>(
      workspaceId,
      'props-panel-open',
    );
    setOpenState(storedOpen === true);
  }, [workspaceId]);

  const setOpen = (newOpen: boolean) => {
    setAnimated(true);
    setOpenState(newOpen);
    writeWorkspaceValue(workspaceId, 'props-panel-open', newOpen);
  };

  return (
    <PropsPanelContext.Provider value={{ open, setOpen, animated }}>
      {children}
    </PropsPanelContext.Provider>
  );
};

export const usePropsPanel = () => {
  const context = useContext(PropsPanelContext);

  if (context === undefined) {
    throw new Error(
      'Cannot call `usePropsPanel` outside of a `PropsPanelProvider`.',
    );
  }

  return context;
};
