/**
 * Single localStorage entry that holds every piece of React Email's cached
 * browser state, keyed first by workspace id (hash of the user's project
 * path) and then by an arbitrary string key.
 *
 * Consolidating under one entry means users can purge everything in one
 * step from DevTools (handy because `localhost` is a shared origin across
 * many tools).
 */
const STORAGE_KEY = 'react-email-data';

type WorkspaceBucket = Record<string, unknown>;
type AllWorkspaces = Record<string, WorkspaceBucket>;

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const readAll = (): AllWorkspaces => {
  if (!isBrowser()) return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!isPlainObject(parsed)) return {};

    // Shallow validation: discard any top-level entry whose value isn't
    // a plain object — protects against hand-edited or corrupted payloads.
    const result: AllWorkspaces = {};
    for (const [id, bucket] of Object.entries(parsed)) {
      if (isPlainObject(bucket)) {
        result[id] = bucket;
      }
    }
    return result;
  } catch {
    return {};
  }
};

const writeAll = (data: AllWorkspaces): void => {
  if (!isBrowser()) return;

  try {
    if (Object.keys(data).length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Swallow quota / serialization errors — persistence is best-effort.
  }
};

export const readWorkspaceValue = <T>(
  workspaceId: string,
  key: string,
): T | undefined => {
  const bucket = readAll()[workspaceId];
  if (!bucket || !(key in bucket)) return undefined;
  return bucket[key] as T;
};

export const writeWorkspaceValue = <T>(
  workspaceId: string,
  key: string,
  value: T | undefined,
): void => {
  const all = readAll();
  const bucket = { ...(all[workspaceId] ?? {}) };

  if (value === undefined) {
    if (!(key in bucket)) return;
    delete bucket[key];
  } else {
    bucket[key] = value;
  }

  if (Object.keys(bucket).length === 0) {
    delete all[workspaceId];
  } else {
    all[workspaceId] = bucket;
  }

  writeAll(all);
};

// Exported for tests and for debugging by name in DevTools.
export const REACT_EMAIL_DATA_STORAGE_KEY = STORAGE_KEY;
