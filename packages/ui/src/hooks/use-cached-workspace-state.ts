import { useSyncExternalStore } from 'react';
import { useWorkspaceId } from '../contexts/workspace';
import {
  readWorkspaceValue,
  writeWorkspaceValue,
} from '../utils/workspace-storage';

/**
 * Reads and writes a value scoped to the current React Email workspace,
 * persisted under the shared `react-email-data` localStorage entry.
 *
 * Behavioral notes (mirrors the older `useCachedState` it replaces):
 * - The value is re-read from storage on every render, so navigating
 *   between contexts that change the `key` picks up the right snapshot.
 * - `setValue` writes to storage but doesn't trigger a re-render (the
 *   external store has a no-op subscribe), so callers typically seed
 *   local React state from this value at first render and call
 *   `setValue` alongside `setState` on updates.
 * - Pass `undefined` to delete the entry.
 */
export const useCachedWorkspaceState = <T>(key: string) => {
  const workspaceId = useWorkspaceId();
  const value = readWorkspaceValue<T>(workspaceId, key);

  return [
    useSyncExternalStore(
      () => () => {},
      () => value,
      () => undefined,
    ),
    function setValue(newValue: T | undefined) {
      writeWorkspaceValue(workspaceId, key, newValue);
    },
  ] as const;
};
