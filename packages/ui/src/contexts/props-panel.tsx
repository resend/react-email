'use client';

import { createContext, useContext, useState } from 'react';
import { useCachedWorkspaceState } from '../hooks/use-cached-workspace-state';

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
  const [cachedOpen, setCachedOpen] =
    useCachedWorkspaceState<boolean>('props-panel-open');
  // Writing to the workspace cache does not re-render, so toggles land in
  // this state and the cached value only matters on load.
  const [override, setOverride] = useState<boolean | undefined>(undefined);
  const [animated, setAnimated] = useState(false);

  const open = override ?? cachedOpen === true;

  const setOpen = (newOpen: boolean) => {
    setAnimated(true);
    setOverride(newOpen);
    setCachedOpen(newOpen);
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
