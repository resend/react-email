import { useMemo, useRef, useSyncExternalStore } from 'react';

export const useSyncExternalStoreWithSelector = <Snapshot, Selection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot: (() => Snapshot) | undefined,
  selector: (snapshot: Snapshot) => Selection,
  isEqual?: (previous: Selection, next: Selection) => boolean,
) => {
  const memoizedSnapshot = useRef<Snapshot>(undefined);
  const memoizedSelection = useRef<Selection>(undefined);
  const hasMemoizedSelection = useRef(false);

  const getSelection = useMemo(() => {
    const selectSnapshot = (snapshot: Snapshot) => {
      if (hasMemoizedSelection.current) {
        const previousSelection = memoizedSelection.current as Selection;

        if (Object.is(memoizedSnapshot.current, snapshot)) {
          return previousSelection;
        }

        const nextSelection = selector(snapshot);
        if (isEqual?.(previousSelection, nextSelection)) {
          memoizedSnapshot.current = snapshot;
          return previousSelection;
        }

        memoizedSnapshot.current = snapshot;
        memoizedSelection.current = nextSelection;
        return nextSelection;
      }

      const nextSelection = selector(snapshot);
      hasMemoizedSelection.current = true;
      memoizedSnapshot.current = snapshot;
      memoizedSelection.current = nextSelection;
      return nextSelection;
    };

    return () => selectSnapshot(getSnapshot());
  }, [getSnapshot, isEqual, selector]);

  const getServerSelection = useMemo(() => {
    if (!getServerSnapshot) {
      return undefined;
    }

    return () => selector(getServerSnapshot());
  }, [getServerSnapshot, selector]);

  return useSyncExternalStore(subscribe, getSelection, getServerSelection);
};
