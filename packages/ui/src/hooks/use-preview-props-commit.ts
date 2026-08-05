'use client';

import { useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { parsePreviewPropsJson } from '../utils/parse-preview-props-json';
import { isErr } from '../utils/result';

// Applying is debounced because every applied value costs a server render:
// per-keystroke applies queue up behind each other and permanently cache
// every intermediate state.
const APPLY_DEBOUNCE_MS = 400;

interface UsePreviewPropsCommitOptions {
  /** The props the preview is currently rendered with. */
  appliedProps: Record<string, unknown>;
  /** Applies a new override, or clears it when passed `undefined`. */
  applyOverride: (props: Record<string, unknown> | undefined) => void;
}

/**
 * Owns how props-panel edits become a preview-props override. Both editing
 * surfaces feed the same debounced apply: `commitProp` merges single-key
 * edits into one pending object so edits within a debounce window don't drop
 * each other, and `commitJson` debounces parsing a raw JSON draft so
 * half-typed JSON doesn't flash errors on every keystroke.
 */
export const usePreviewPropsCommit = ({
  appliedProps,
  applyOverride,
}: UsePreviewPropsCommitOptions) => {
  const [parseError, setParseError] = useState<string | undefined>(undefined);

  const pendingProps = useRef<Record<string, unknown> | undefined>(undefined);

  const apply = useDebouncedCallback((props: Record<string, unknown>) => {
    applyOverride(props);
  }, APPLY_DEBOUNCE_MS);

  const commitProp = (key: string, value: unknown) => {
    pendingProps.current = {
      ...(pendingProps.current ?? appliedProps),
      [key]: value,
    };
    setParseError(undefined);
    apply(pendingProps.current);
    // Discrete edits (e.g. toggling a switch) should not lag behind the
    // typing debounce.
    if (typeof value === 'boolean') {
      apply.flush();
    }
  };

  const commitJson = useDebouncedCallback((text: string) => {
    const result = parsePreviewPropsJson(text);
    if (isErr(result)) {
      setParseError(result.error);
      return;
    }
    setParseError(undefined);
    pendingProps.current = undefined;
    // Routing through `apply` supersedes any pending single-key apply, so an
    // older controls edit can't fire afterwards and clobber this one.
    apply(result.value);
    apply.flush();
  }, APPLY_DEBOUNCE_MS);

  /**
   * Settles a pending JSON draft right away: a valid draft applies now, an
   * invalid one is abandoned together with its parse error.
   */
  const flushJson = () => {
    commitJson.flush();
    setParseError(undefined);
  };

  const reset = () => {
    apply.cancel();
    commitJson.cancel();
    pendingProps.current = undefined;
    setParseError(undefined);
    applyOverride(undefined);
  };

  return { parseError, commitProp, commitJson, flushJson, reset };
};
